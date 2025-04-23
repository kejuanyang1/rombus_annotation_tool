from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
import json, cv2, numpy as np
import open3d as o3d
import quaternion  # pip install numpy-quaternion
import math
import ast


DATA_DIR   = Path("../data")
OUT_DIR    = Path("../output")
OUT_DIR.mkdir(exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

# ---------- Models ----------
class BBox(BaseModel):
    cx: float   # pixel
    cy: float
    w:  float   # pixel width  (long side) – still in image plane
    h:  float   # pixel height
    angle: float  # degrees, CCW; 0 points right

class AnnotationIn(BaseModel):
    image_id: str    # e.g. "scene_05_2"
    label: str
    bbox:  BBox

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
        z_tol: float = 0.02      # ignore outliers farther than ±z_tol from median
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
    zs = zs[np.isfinite(zs) & (zs > 0)]
    if zs.size == 0:
        return None, None, None

    # clip extreme outliers
    med = np.median(zs)
    zs = zs[np.abs(zs - med) <= z_tol]

    if zs.size == 0:
        return None, None, None

    height_m = float(zs.max() - zs.min())

    # w, h like before (use bbox edges & median depth)
    w_px, h_px = rect[1]
    depth_for_size = float(med)         # robust depth for size estimate
    w_m = w_px * depth_for_size / fx
    h_m = h_px * depth_for_size / fy
    return w_m, h_m, height_m



# ---------- End‑points ----------
@app.get("/api/images")
def list_images(start: str):
    """Return RGB image IDs ≥ start (inclusive, lexicographic)."""
    imgs = sorted(p.stem[:-4] for p in DATA_DIR.glob("*_rgb.png"))
    if start not in imgs:
        raise HTTPException(404, f"{start} not found")
    return [im for im in imgs if im >= start]

@app.get("/api/image/{image_id}/rgb")
def get_rgb(image_id: str):
    f = DATA_DIR / f"{image_id}_rgb.png"
    if not f.exists(): raise HTTPException(404)
    return FileResponse(f)

@app.post("/api/annotate")
def annotate(ann: AnnotationIn):
    """
    Store *two* things for the current image:

    1. 3‑D record  →  output/<image_id>.json     (unchanged)
    2. 2‑D box     →  output/<image_id>_bbox.json  (new)
       box = [x, y, w, h, angle_deg]  (COCO‑like, top‑left origin)
    """
    img_id = ann.image_id
    bbox   = ann.bbox

    # ---------- intrinsics & extrinsics ----------
    K, trans, q_cam2base, height, width = load_metadata(img_id)
    fx, fy = K[0, 0], K[1, 1]
    cx, cy = K[0, 2], K[1, 2]
    # print(fx, fy, cx, cy)

    # ---------- depth image ----------
    cloud_path = DATA_DIR / f"{img_id}_cloud.ply"
    K_for_depth = dict(fx=fx, fy=fy, cx=cx, cy=cy)
    depth_path = DATA_DIR / f"{img_id}_depth_new.png"
    ply_to_depth_png(cloud_path, (height, width), K_for_depth, depth_path)
    depth_meters = cv2.imread(depth_path, cv2.IMREAD_UNCHANGED)
    if depth_meters is None:
        raise HTTPException(422, "depth image invalid")
    
    # print(depth_meters.shape, depth_meters.dtype, depth_meters.max(), depth_meters.min())
    # print(depth_meters)
    depth_meters = depth_meters.astype(np.float32) / 1000.0  # mm to m
    # print(np.sum(depth_meters == 0), "zero pixels")
    # print(np.sum(depth_meters > 0), "non-zero pixels")

    u, v = int(bbox.cx), int(bbox.cy)
    # print(depth_meters[u, v])
    depth_m = filtered_depth(depth_meters, u, v)
    # print(depth_m)
    if depth_m is None:
        raise HTTPException(422, "depth invalid at bbox centre")

    # ---------- 3‑D centre in base‑link ----------
    p_cam  = pixel_to_cam(K, u, v, depth_m)
    p_base = cam_to_base(p_cam, trans, q_cam2base)

    # ---------- metric (w, h) ----------
    rect  = ((bbox.cx, bbox.cy), (bbox.w, bbox.h), -bbox.angle)
    w_m, h_m, height_m = metric_size_and_height(K.copy(), depth_meters, rect)

    if w_m is None:          # fall-back in degenerate cases
        w_m = bbox.w * depth_m / K[0,0]
        h_m = bbox.h * depth_m / K[1,1]
        height_m = 0.0

    # ---------- orientation ----------
    orient_quat = yaw_to_quat(bbox.angle)

    # ---------- 3‑D record (unchanged file) ----------
    rec3d = {
        "name": ann.label,
        "position": p_base.tolist(),
        "orientation": orient_quat,
        "size": [w_m, h_m, height_m]                 # metres now
    }
    rec3d_path = OUT_DIR / f"{img_id}.json"
    rec3d_list = json.loads(rec3d_path.read_text()) if rec3d_path.exists() else []
    rec3d_list.append(rec3d)
    rec3d_path.write_text(json.dumps(rec3d_list, indent=2))

    # ---------- 2‑D bounding‑box record ----------
    # Common COCO‑like format: [x, y, w, h, angle_deg] in *image* pixels
    # x,y originate at top‑left corner of image
    x_tl = bbox.cx - bbox.w / 2
    y_tl = bbox.cy - bbox.h / 2
    rec2d = {
        "name": ann.label,
        "bbox": [x_tl, y_tl, bbox.w, bbox.h, bbox.angle]
    }
    rec2d_path = OUT_DIR / f"{img_id}_bbox.json"
    rec2d_list = json.loads(rec2d_path.read_text()) if rec2d_path.exists() else []
    rec2d_list.append(rec2d)
    rec2d_path.write_text(json.dumps(rec2d_list, indent=2))

    return {
        "status": "ok",
        "3d": rec3d,
        "2d": rec2d
    }


@app.get("/api/image/{image_id}/objects")
def get_objects(image_id: str):
    """Return container_name + object_names as a flat list for a drop-down."""
    meta_path = DATA_DIR / f"{image_id}_metadata.json"
    if not meta_path.exists():
        return []

    meta = json.loads(meta_path.read_text())

    # container_name may be a stringified list: "['item1','item2']"
    container = meta.get("container_name", [])
    if isinstance(container, str):
        try:
            container = ast.literal_eval(container)
        except Exception:
            container = [container]
    if isinstance(container, str):
        container = [container]

    objs = meta.get("object_names", [])
    return [s.strip() for s in container] + [s.strip() for s in objs]