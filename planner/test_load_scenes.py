import pandas as pd
import json

csv_path = "/Users/ykj/Downloads/_ROMBUS dataset - Scenes.csv"
objects_json_path = "/Users/ykj/Desktop/github/ROMBUS/assets/objects.json"
scene_categories = ['kitchen', 'office', 'other', 'shape', 'tool']

with open(objects_json_path) as f:
    objects = json.load(f)

def ids_to_names(obj_ids: list[str]) -> list[str]:
    # obj_ids may contain duplicates
    output = []
    for x in objects:
        if x['id'] in obj_ids:
            for _ in range(obj_ids.count(x['id'])):
                output.append(x['name'])
    return output

def ids_to_items(obj_ids: list[str]) -> list[dict]:
    # obj_ids may contain duplicates
    output = []
    for x in objects:
        if x['id'] in obj_ids:
            for _ in range(obj_ids.count(x['id'])):
                output.append({
                    "id": x['id'],
                    "name": x['name'],
                    "category": x['category'],            
                })
    return output

if __name__ == '__main__':
    df = pd.read_csv(csv_path)
    result = []
    for _, row in df.iterrows():
        obj_ids = sorted(eval(row['obj_ids']))
        container_ids = sorted(eval(row['container_ids']))
        category = row['category']
        quantity = len(obj_ids) + len(container_ids)
        
        if category.lower() in scene_categories:
            category = f"['{category}']"
        obj_names = ids_to_names(obj_ids)
        container_names = ids_to_names(container_ids)
        assert sorted(obj_names) == sorted(eval(row['obj_names'])), f"Scene {_+1} Wrong match:\n{sorted(obj_names)}\n{sorted(eval(row['obj_names']))}"
        assert sorted(container_names) == sorted(eval(row['container_names'])), f"Scene {_+1} Wrong match:\n{sorted(container_names)}\n{sorted(eval(row['container_names']))}"
        assert quantity == int(row['quantity']), f"Scene {_+1} Wrong match:\n{quantity}\n{int(row['quantity'])}"
        
        entry = {
            'scene_id': row['scene_id'],
            'obj_ids': obj_ids + container_ids,
            'objects': ids_to_items(obj_ids + container_ids),
            'category': sorted(eval(category)),
            'quantity': quantity
        }
        result.append(entry)

    assert len(result) == 80
    save_file = "/Users/ykj/Desktop/github/ROMBUS/assets/scenes.json"
    with open(save_file, 'w') as f:
        json.dump(result, f)
