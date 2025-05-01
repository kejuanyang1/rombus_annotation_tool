#!/usr/bin/env python3

import argparse
import json
import re
import ast
from pathlib import Path

import numpy as np
from PIL import Image as PILImage
from tqdm import tqdm

from nanoowl.owl_predictor import OwlPredictor
from nanoowl.owl_drawing import draw_owl_output

# ----------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------
def parse_query(query_str: str) -> list[str]:
    """Split comma-separated query string into strip-clean list."""
    return [t.strip() for t in re.split(r"[;,]", query_str) if t.strip()]



def format_detection(report):
    """Nicely format detection dict for console output."""
    return (
        f"{report['id']:>10s} | cls='{report['category']}' | "
        f"bbox=({report['bbox_w']:.0f}×{report['bbox_h']:.0f})@"
        f"({report['cx']:.0f},{report['cy']:.0f}) | "
        f"conf={report['conf']:.3f}"
    )
    
def load_queries_from_metadata(meta_root: Path) -> dict:
    def add_article(name: str) -> str:
        name = name.strip()
        article = "an" if name[0].lower() in "aeiou" else "a"
        return f"{article} {name}"

    image_query_dict = {}

    for i in range(80, 81):  # scene_01 to scene_80
        for j in range(3):  # 0, 1, 2
            scene_id = f"scene_{i:02d}_{j}"
            meta_path = meta_root / f"{scene_id}_metadata.json"
            if not meta_path.exists():
                continue

            with open(meta_path, "r") as f:
                meta = json.load(f)

            
            object_names = meta.get("object_names", [])
            container_names = meta.get("container_name", [])
            container_names = ast.literal_eval(container_names)


            # Add article (a/an) to each name
            container_names = [add_article(name) for name in container_names] 
            all_items = container_names + object_names
            query_str = ", ".join(all_items)
            image_query_dict[scene_id] = query_str

    return image_query_dict


def process_image(image_path: str, query: str, out_path: Path, predictor: OwlPredictor):
    text_list = parse_query(query)
    thresholds = [0.1] * len(text_list)

    rgb_pil = PILImage.open(image_path)
    w, h = rgb_pil.size

    text_enc = predictor.encode_text(text_list)
    output = predictor.predict(
        image=rgb_pil,
        text=text_list,
        text_encodings=text_enc,
        threshold=thresholds,
        nms_threshold=0.5,
        pad_square=False,
    )

    best = {}
    for i, box in enumerate(output.boxes):
        cls_idx = int(output.labels[i])
        cls_name = text_list[cls_idx]
        conf = float(output.scores[i])
        x1, y1, x2, y2 = [float(x) for x in box]
        bbox_w, bbox_h = abs(x2 - x1), abs(y2 - y1)
        if bbox_w >= 0.7 * w and bbox_h >= 0.7 * h:
            continue
        if cls_name not in best or conf > best[cls_name]["conf"]:
            best[cls_name] = {"box": (x1, y1, x2, y2), "conf": conf}

    if not best:
        print(f"No valid detections for {image_path}")
        return

    reports = []
    for idx, (obj_cls, data) in enumerate(best.items(), start=1):
        x1, y1, x2, y2 = data["box"]
        cx, cy = 0.5 * (x1 + x2), 0.5 * (y1 + y2)
        reports.append(dict(
            id=f"obj_{idx}",
            category=obj_cls,
            cx=cx, cy=cy,
            bbox_w=abs(x2 - x1),
            bbox_h=abs(y2 - y1),
            conf=data["conf"],
        ))

    drawn = draw_owl_output(rgb_pil, output, text=text_list, draw_text=True)
    drawn.save(out_path.with_suffix(".png"))

    image_id = Path(image_path).stem
    json_output = {
        image_id: [
            {
                "bbox": {
                    "cx": r["cx"],
                    "cy": r["cy"],
                    "w": r["bbox_w"],
                    "h": r["bbox_h"],
                    "angle": 0.0
                },
                "category": r["category"],
                "conf": r["conf"]
            }
            for r in reports
        ]
    }

    with open(out_path.with_suffix(".json"), "w") as f:
        json.dump(json_output, f, indent=2)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--img_dir", required=True, help="Directory of images")
    parser.add_argument("--out_dir", default="outputs", help="Directory to save results")
    args = parser.parse_args()

    img_dir = Path(args.img_dir)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    image_queries = load_queries_from_metadata(img_dir)  # or meta_dir if metadata is elsewhere


    predictor = OwlPredictor(
        "google/owlvit-base-patch32",
        device="mps",
        image_encoder_engine=None,
    )
    
    for image_id, query in tqdm(image_queries.items()):
        image_path = img_dir / f"{image_id}_rgb.png"
        if not image_path.exists():
            print(f"Image {image_path} not found. Skipping.")
            continue
        out_path = out_dir / image_id
        process_image(str(image_path), query, out_path, predictor)



if __name__ == "__main__":
    main()
