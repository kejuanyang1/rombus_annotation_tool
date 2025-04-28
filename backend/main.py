"""
backend/main.py  –  FastAPI for RGB-depth annotation (multi-bbox version)
"""
from pathlib import Path
import json, ast, math
import numpy as np
import cv2
# import quaternion
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List
import open3d as o3d
import quaternion

# -------------------------------------------------------------- paths -----
ROOT          = Path(__file__).parent.parent
DATA_DIR      = ROOT / "data"
OUT_DIR       = ROOT / "output"
HELPER_DIR    = ROOT / "outputs_helper"
OUT_DIR.mkdir(exist_ok=True)

# -------------------------------------------------------------- FastAPI ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

# ------------------------------------------------------------ Pydantic ----
class BBox(BaseModel):
    cx: float; cy: float; w: float; h: float; angle: float = 0.0

class Annotation(BaseModel):
    bbox:   BBox
    label:  str = Field(alias="category")
    conf:   float | None = None          # optional

class AnnotationList(BaseModel):
    image_id: str
    annos:    List[Annotation]

# ----------------------------------------------------------- utilities ----
def read_json(path: Path, default):
    try:   return json.loads(path.read_text())
    except FileNotFoundError: return default

def load_helper_boxes(image_id: str) -> list:
    """
    Convert helper format
      {bbox:{cx,cy,w,h,angle}, category, conf}
    ➜ common format
      {"name": category, "bbox": [x,y,w,h,angle]}
    """
    p = HELPER_DIR / f"{image_id}.json"
    if not p.exists():
        return []

    raw = read_json(p, {})
    items = raw.get(f"{image_id}_rgb", [])
    out   = []
    for it in items:
        bb = it["bbox"]
        out.append({
            "name": it["category"],
            "bbox": [
                bb["cx"] - bb["w"]/2,
                bb["cy"] - bb["h"]/2,
                bb["w"],
                bb["h"],
                bb.get("angle", 0.0)
            ],
            "conf": it.get("conf", None)
        })
    return out

def load_saved_boxes(image_id: str):
    p = OUT_DIR / f"{image_id}_bbox.json"
    if not p.exists():
        return []

    raw = read_json(p, {})
    items = raw
    out   = []
    for it in items:
        bb = it["bbox"]
        out.append({
            "name": it["category"],
            "bbox": [
                bb["cx"] - bb["w"]/2,
                bb["cy"] - bb["h"]/2,
                bb["w"],
                bb["h"],
                bb.get("angle", 0.0)
            ],
            "conf": it.get("conf", None)
        })
    return out

def get_common_boxes(image_id: str) -> list:
    """
    Manual (if any) overrides helper; otherwise helper list.
    """
    manual = load_saved_boxes(image_id)
    return manual if manual else load_helper_boxes(image_id)

def save_boxes(image_id: str, annos: list):
    (OUT_DIR / f"{image_id}_bbox.json").write_text(json.dumps(annos, indent=2))

# ---------- Utils ----------
def load_metadata(image_id: str):
    meta_path = DATA_DIR / f"{image_id}_metadata.json"
    with open(meta_path) as f:
        meta = json.load(f)
    K   = np.array(meta["camera_intrinsics"]["K"]).reshape(3,3)
    Tcb = meta["camera_to_base_link"]          # Dict with translation/rotation
    trans = np.array([Tcb["translation"][k] for k in ("x","y","z")])
    qxyzw = np.array([Tcb["rotation"][k] for k in ("x","y","z","w")])
    q_cam2base = np.quaternion(qxyzw[3], *qxyzw[:3])  # w, x, y, z
    height, width = meta["camera_intrinsics"]["height"], meta["camera_intrinsics"]["width"]
    return K, trans, q_cam2base, height, width

def pixel_to_cam(K, u, v, depth_m):
    fx, fy = K[0,0], K[1,1]
    cx, cy = K[0,2], K[1,2]
    x = (u - cx) * depth_m / fx
    y = (v - cy) * depth_m / fy
    z = depth_m
    return np.array([x, y, z])        # camera frame

def cam_to_base(pt_cam, trans, q_cam2base):
    # rotate then translate
    pt_base = q_cam2base * np.quaternion(0,*pt_cam) * q_cam2base.conjugate()
    return np.array([pt_base.x, pt_base.y, pt_base.z]) + trans

def yaw_to_quat(yaw_deg):
    yaw = math.radians(yaw_deg)
    q = np.quaternion(
        math.cos(yaw/2), 0, 0, math.sin(yaw/2)  # w, x, y, z
    )
    return [q.x, q.y, q.z, q.w]

# ---- Robust depth sampler ----------------------------------------------------
def filtered_depth(
        depth_m: np.ndarray,          # depth in *metres*, H×W
        x: int,
        y: int,
        window_size: int = 5,
        max_diff: float = 0.02        # metres
    ) -> float | None:
    """
    Median-filter a (window_size × window_size) patch around (x,y),
    drop NaN / Inf / outliers (> max_diff from median), return median(m).
    """
    h, w = depth_m.shape
    half = window_size // 2
    x1, x2 = max(0, x-half),  min(w, x+half+1)
    y1, y2 = max(0, y-half),  min(h, y+half+1)
    # print(vals)
    # print(depth_m[y1:y2, x1:x2])
    vals = depth_m[y1:y2, x1:x2].ravel()
    # print(vals)
    vals = vals[np.isfinite(vals)]
    vals = vals[vals > 0]          # drop NaN / Inf / 0
    # print(vals)
    if vals.size == 0:
        return None

    med = np.median(vals)
    good = vals[np.abs(vals - med) <= max_diff]
    if good.size == 0:
        return None
    return float(np.median(good))

def ply_to_depth_png(ply_path: str,
                     img_size: tuple[int, int],   # (height, width)
                     intrinsics: dict,
                     out_png: str):
    """
    Convert a point cloud in `ply_path` to a 16-bit depth image (millimetres).

    Parameters
    ----------
    ply_path : str
        Path to cloud.ply
    img_size : (H, W)
        Target depth image resolution
    intrinsics : dict
        {"fx": ..., "fy": ..., "cx": ..., "cy": ...}
        The *pinhole* intrinsics that were used when the cloud was captured.
    out_png : str
        Where to save the depth image (16-bit PNG)
    """
    # if out_png already exists, skip
    if Path(out_png).exists():
        print(f"Skipping {out_png} (already exists)")
        return
    pc  = o3d.io.read_point_cloud(ply_path)
    xyz = np.asarray(pc.points)                     # (N,3) in metres
    valid_z = xyz[:, 2] > 1e-6
    xyz = xyz[valid_z]

    H, W           = img_size
    fx, fy, cx, cy = intrinsics.values()

    # ---- 1. project each 3-D point into the 2-D image plane ---- #
    u = (xyz[:, 0] * fx / xyz[:, 2] + cx).round().astype(int)
    v = (xyz[:, 1] * fy / xyz[:, 2] + cy).round().astype(int)

    # ---- 2. keep only the points that land in the image ---- #
    inside = (u >= 0) & (u < W) & (v >= 0) & (v < H)
    u, v, z = u[inside], v[inside], xyz[:, 2][inside]     # z in metres

    # ---- 3. initialise an *empty* depth map with +inf (so min keeps nearest) ---- #
    depth_m = np.full((H, W), np.inf, dtype=np.float32)

    for ui, vi, zi in zip(u, v, z):
        depth_m[vi, ui] = min(depth_m[vi, ui], zi)

    # Pixels that never received a point are still +inf → mark them 0 mm
    depth_mm = np.where(np.isfinite(depth_m), (depth_m * 1000.0), 0).astype(np.uint16)

    cv2.imwrite(out_png, depth_mm)
    print(f"Saved depth map: {out_png}  ({W}×{H}, uint16)")



def metric_size_from_corners(
        K: np.ndarray,
        depth_m: np.ndarray,          # depth in *metres*
        rect: tuple,
        auto_resize: bool = True,
        min_valid: int = 2
    ):
    """
    Robust (w,h) in metres; uses filtered_depth on each edge-endpoint.
    """
    h_img, w_img = depth_m.shape
    # --- auto resize same逻辑（略） ---
    fx, fy = K[0,0], K[1,1]
    corners = cv2.boxPoints(rect)          # 4×2
    corners_px = np.round(corners).astype(int)

    acc = { "w": [], "h": [] }
    for i in range(4):
        p0 = corners_px[i]
        p1 = corners_px[(i+1) % 4]

        for p in (p0, p1):
            if not (0 <= p[0] < w_img and 0 <= p[1] < h_img):
                break      # edge partly outside → skip
        else:
            z0 = filtered_depth(depth_m, *p0)
            z1 = filtered_depth(depth_m, *p1)
            if z0 is None or z1 is None:
                continue
            z = 0.5*(z0+z1)

            du, dv = p1 - p0
            dx = du * z / fx
            dy = dv * z / fy
            length = math.hypot(dx, dy)
            acc["w" if i%2==0 else "h"].append(length)

    if len(acc["w"]) < min_valid or len(acc["h"]) < min_valid:
        return None, None
    return float(np.mean(acc["w"])), float(np.mean(acc["h"]))

# ---- size + height helper ---------------------------------------------------
def metric_size_and_height(
        K: np.ndarray,
        depth_m: np.ndarray,     # depth in metres, same resolution as RGB
        rect: tuple,             # ((cx,cy),(w,h),angle_deg)  from cv2.minAreaRect
        z_pos: float,            # depth of the table height (translation z from metadata)
        z_tol: float = 0.5      # ignore outliers farther than ±z_tol from median
        
    ):
    """
    Returns (w_m, h_m, height_m) where height_m = maxZ - minZ inside the box.
    """
    fx, fy = K[0,0], K[1,1]
    h_img, w_img = depth_m.shape
    mask = np.zeros_like(depth_m, dtype=np.uint8)

    poly = cv2.boxPoints(rect).astype(np.int32)
    cv2.fillPoly(mask, [poly], 1)

    zs = depth_m[mask == 1]
    zs = zs[np.isfinite(zs) & (zs > 0)]  # drop NaN / Inf / 0
    if zs.size == 0:
        return None, None, None

    # clip extreme outliers
    med = np.median(zs)
    zs = zs[np.abs(zs - med) <= z_tol]

    if zs.size == 0:
        return None, None, None
    print(zs.max(), zs.min())
    height_m = float(z_pos - zs.min())

    if height_m < 0.03:
        height_m = 0.03
    
    if height_m > 0.18:
        height_m = 0.18

    # w, h like before (use bbox edges & median depth)
    w_px, h_px = rect[1]
    depth_for_size = float(med)         # robust depth for size estimate
    w_m = np.abs(w_px) * depth_for_size / fx
    h_m = np.abs(h_px) * depth_for_size / fy
    return w_m, h_m, height_m



# ---------- End‑points ----------
@app.get("/api/images")
def list_images(start: str):
    imgs = sorted(p.stem[:-4] for p in DATA_DIR.glob("*_rgb.png"))
    if start not in imgs:
        raise HTTPException(404, "start image not found")
    return [im for im in imgs if im >= start]

@app.get("/api/image/{image_id}/rgb")
def get_rgb(image_id: str):
    f = DATA_DIR / f"{image_id}_rgb.png"
    if not f.exists(): raise HTTPException(404)
    return FileResponse(f)

@app.get("/api/image/{image_id}/objects")  # dropdown helper
def get_object_candidates(image_id: str):
    def add_article(name: str) -> str:
        name = name.strip()
        article = "an" if name[0].lower() in "aeiou" else "a"
        return f"{article} {name}"
    meta = read_json(DATA_DIR / f"{image_id}_metadata.json", {})
    container = meta.get("container_name", [])
    if isinstance(container, str):
        try: container = ast.literal_eval(container)
        except Exception: container = [container]
    if isinstance(container, str): container = [container]
    if isinstance(container, list):
        container = [add_article(c) for c in container]
    else:
        container = [add_article(container)]
    return [*map(str.strip, container), *map(str.strip, meta.get("object_names", []))]

@app.get("/api/image/{image_id}/annotations")
def get_init_annotations(image_id: str):
    return get_common_boxes(image_id)

@app.post("/api/annotate")
def annotate_list(payload: AnnotationList):
    """
    • Save 2-D boxes  → output/<id>.json
    • Save 3-D info   → output/<id>_3d.json
    """
    annos2d = [a.dict(by_alias=True) for a in payload.annos]
    save_boxes(payload.image_id, annos2d)

    img_id = payload.image_id

    K, trans, q_cam2base, height, width = load_metadata(img_id)
    fx, fy = K[0, 0], K[1, 1]
    cx, cy = K[0, 2], K[1, 2]


    # ---------- build 3-D records ----------
    # load assets once
    cloud_path = DATA_DIR / f"{img_id}_cloud.ply"
    K_for_depth = dict(fx=fx, fy=fy, cx=cx, cy=cy)
    depth_path = DATA_DIR / f"{img_id}_depth_new.png"
    ply_to_depth_png(cloud_path, (height, width), K_for_depth, depth_path)
    depth_meters = cv2.imread(depth_path, cv2.IMREAD_UNCHANGED)
    if depth_meters is None:
        raise HTTPException(422, "depth image invalid")
    
    # print(depth_meters.shape, depth_meters.dtype, depth_meters.max(), depth_meters.min())
    # print(depth_meters)
    depth_m = depth_meters.astype(np.float32) / 1000.0  # mm to m
    # print(np.sum(depth_meters == 0), "zero pixels")
    # print(np.sum(depth_meters > 0), "non-zero pixels")


    rec3d = []
    print(annos2d)
    for a in annos2d:
        bb = a["bbox"]
        cx, cy = int(bb["cx"]), int(bb["cy"])
        depth_c = filtered_depth(depth_m, cx, cy)
        if depth_c is None: continue

        # position
        pt_cam  = pixel_to_cam(K, cx, cy, depth_c)
        pt_base = cam_to_base(pt_cam, trans, q_cam2base)

        # size (w, h, height)
        rect = ((bb["cx"], bb["cy"]), (bb["w"], bb["h"]), -bb["angle"])
        w_m, h_m, hZ = metric_size_and_height(K, depth_m, rect, depth_c)
        print(a)
        rec3d.append({
            "name": a["category"],
            "position": pt_base.tolist(),
            "orientation": yaw_to_quat(bb["angle"]),
            "size": [w_m, h_m, hZ]
        })

    (OUT_DIR / f"{payload.image_id}_3d.json").write_text(json.dumps(rec3d, indent=2))
    return {"status": "ok", "boxes_saved": len(annos2d), "rec3d": len(rec3d)}
