import pandas as pd
import json
import os
import re
import copy
from collections import defaultdict, deque
from scipy.spatial.transform import Rotation as R
from utils import *

scenes_json_path = "/Users/ykj/Desktop/github/ROMBUS/assets/scenes.json"
scenes = load_json(scenes_json_path)

def clean_and_round(raw_data):
    """
    Cleans 'name' by removing leading 'a ' or 'an ' and rounds all numeric values
    (floats in lists or standalone) to 3 decimal places.
    """
    cleaned = []
    for item in raw_data:
        new_item = {}
        for key, value in item.items():
            if key == 'name' and isinstance(value, str):
                # Remove leading "a " or "an "
                cleaned_name = re.sub(r'^(?:a|an)\s+', '', value, flags=re.IGNORECASE).strip()
                new_item['name'] = cleaned_name
            elif isinstance(value, list):
                # Round each float in the list to 3 decimals
                rounded_list = [
                    round(v, 3) if isinstance(v, float) else v
                    for v in value
                ]
                new_item[key] = rounded_list
            elif isinstance(value, float):
                new_item[key] = round(value, 3)
            else:
                # leave other types unchanged
                new_item[key] = value
        cleaned.append(new_item)
    return cleaned


def enrich_scene(scene_objects, detections):
    # Make a deep copy so we never touch the original list
    base = copy.deepcopy(scene_objects)

    extras_map = defaultdict(deque)
    for det in detections:
        extras_map[det['name']].append(det)

    enriched = []
    for obj in base:
        det_queue = extras_map[obj['name']]
        if det_queue:
            det = det_queue.popleft()
            for field in ('position', 'orientation', 'size'):
                if field in det:
                    value = det[field]
                    # If orientation is quaternion, convert to Euler
                    if field == 'orientation' and isinstance(value, list) and len(value) == 4:
                        # scipy expects quaternion as [x, y, z, w]
                        rot = R.from_quat(value)
                        euler = rot.as_euler('xyz', degrees=True)
                        obj[field] = [round(a, 0) for a in euler]
                    else:
                        obj[field] = value
        enriched.append(obj)
    return enriched

def add_corner_case(scene_objects: list):
    scene_objects = scene_objects[:-3] + [{
        'id': 'shape_26', 'name': 'small green triangular prism', 'category': 'item'
    }] + scene_objects[-3:]
    return scene_objects


root_path = "/Users/ykj/Desktop/github/rombus_annotation_tool/output"
# TODO: remove this selected_set
selected_set = ['01_0', '01_1', '01_2', '02_0', '02_1', '02_2', '03_0', '03_1', '04_0', '04_1', '04_2', '05_0', '05_1', '05_2', '06_0', '06_1', '06_2', '07_0', '07_2', '08_0', '08_1', '09_0', '09_1', '09_2', '10_1', '10_2', '11_0', '11_2', '12_0', '12_1', '12_2', '13_0', '13_1', '13_2', '14_1', '14_2', '15_0', '15_1', '15_2', '17_0', '17_1', '17_2', '18_0', '18_1', '18_2', '19_0', '19_1', '20_0', '20_1', '20_2', '21_0', '21_2', '22_0', '22_1', '22_2', '23_0', '23_1', '23_2', '24_1', '24_2', '25_0', '25_1', '25_2', '26_0', '26_1', '26_2', '27_0', '27_1', '27_2', '28_0', '28_1', '28_2', '29_0', '29_1', '29_2', '30_0', '30_1', '30_2', '31_0', '31_2', '32_2', '33_0', '33_1', '34_0', '34_2', '37_0', '37_1', '37_2', '39_1', '39_2', '42_1', '42_2', '44_0', '44_1', '44_2', '47_2', '49_0', '49_1', '49_2', '54_0', '55_0', '55_1', '55_2', '56_0', '56_1', '56_2', '57_1', '57_2', '58_0', '58_1', '58_2', '59_0', '59_1', '59_2', '60_0', '60_1', '60_2', '61_0', '61_1', '62_0', '62_1', '62_2', '63_0', '63_1', '63_2', '65_1', '65_2', '66_0', '66_1', '66_2', '67_1', '68_1', '68_2', '69_0', '69_1', '69_2', '70_0', '70_1', '70_2', '71_0', '71_1', '71_2', '73_1', '73_2', '74_0', '74_1', '75_1', '76_0', '76_1', '76_2', '77_0', '77_1', '77_2', '78_0', '78_1', '79_1', '79_2', '80_0', '80_1', '80_2']
results = []

for fpath in sorted(os.listdir(root_path)):
    if '_3d.json' not in fpath:
        continue
    scene_id, layout = int(fpath.split('_')[1]), int(fpath.split('_')[2])
    task_id = f"{scene_id:02d}_{layout}"
    # if task_id not in selected_set:
    #     continue
    scene_objects = scenes[scene_id-1]["objects"]
    if task_id == '47_1':
        scene_objects = add_corner_case(scene_objects.copy())

    raw_data = load_json(os.path.join(root_path, fpath))
    obj_poses = clean_and_round(raw_data)
    extracted_obj_names = [obj['name'] for obj in obj_poses]
    scene_obj_names = [obj['name'] for obj in scene_objects]
    try:
        assert sorted(extracted_obj_names) == sorted(scene_obj_names)
    except:
        print(f"\nScene {scene_id}_{layout} Wrong match:\nPose file: {sorted(extracted_obj_names)}\nRecorded: {sorted(scene_obj_names)}")
        continue
    # assert sorted(extracted_obj_names) == sorted(scene_obj_names), f"\nScene {scene_id}_{layout} Wrong match:\nPose file: {sorted(extracted_obj_names)}\nRecorded: {sorted(scene_obj_names)}"
    
    merged_poses = enrich_scene(scene_objects, obj_poses)

    groups = defaultdict(list)
    for obj in merged_poses:
        groups[obj["id"]].append(obj)

    renamed = []
    for obj_id, objs in groups.items():
        if len(objs) == 1:
            renamed.append(objs[0])
        else:
            # 对拥有相同 id 的物体按 x 坐标从小到大排序，并依次追加后缀 _1, _2, ...
            for idx, o in enumerate(sorted(objs, key=lambda d: d["position"][0], reverse=True), 1):
                renamed.append({**o, "id": f"{obj_id}_{idx}"})
    
    entry = {
        'task_id': task_id,
        'obj_ids': [obj["id"] for obj in renamed],
        'objects': renamed,
        'category': scenes[scene_id-1]["category"],
        'quantity': len(renamed)
    }
    results.append(entry)


save_file = "/Users/ykj/Desktop/github/ROMBUS/assets/poses.json"
with open(save_file, 'w') as f:
    json.dump(results, f)
    
    



