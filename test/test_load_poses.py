import pandas as pd
import json
import os
import re


scenes_json_path = "/Users/ykj/Desktop/github/ROMBUS/assets/scenes.json"

def load_json(json_path):
    with open(json_path) as f:
        return json.load(f)

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

root_path = "/Users/ykj/Desktop/github/rombus_annotation_tool/output"
for fpath in sorted(os.listdir(root_path)):
    if '_3d.json' not in fpath:
        continue
    scene_id = int(fpath.split('_')[1])
    layout = int(fpath.split('_')[2])
    scene_objects = scenes[scene_id-1]["objects"]

    raw_data = load_json(os.path.join(root_path, fpath))
    obj_poses = clean_and_round(raw_data)
    extracted_obj_names = [obj['name'] for obj in obj_poses]
    scene_obj_names = [obj['name'] for obj in scene_objects]
    try:
        assert sorted(extracted_obj_names) == sorted(scene_obj_names)
    except:
        print(f"\nScene {scene_id}_{layout} Wrong match:\nPose file: {sorted(extracted_obj_names)}\nRecorded: {sorted(scene_obj_names)}")

    # assert sorted(extracted_obj_names) == sorted(scene_obj_names), f"\nScene {scene_id}_{layout} Wrong match:\nPose file: {sorted(extracted_obj_names)}\nRecorded: {sorted(scene_obj_names)}"
    



