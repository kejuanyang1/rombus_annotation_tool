import os
import random
import json
import numpy as np
import hashlib
from typing import List, Dict, Any



def load_json(json_path):
    with open(json_path) as f:
        return json.load(f)
    
    
def save_json(data, json_path):
    with open(json_path, 'w') as f:
        json.dump(data, f)


def load_file(filepath: str):
    with open(filepath, 'r') as f:
        return f.read()


def save_file(text: str, filepath: str):
    with open(filepath, 'w') as f:
        f.write(text)


def list_to_dict_by_id(items: List[Dict[str, Any]], id_key: str = "task_id") -> Dict[str, Dict[str, Any]]:
    result: Dict[str, Dict[str, Any]] = {}
    for item in items:
        if id_key not in item:
            raise KeyError(f"Item {item} lacks required key '{id_key}'.")
        result[item[id_key]] = {k: v for k, v in item.items() if k != id_key}
    return result