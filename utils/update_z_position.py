import json
from pathlib import Path

# Paths
POSES_PATH = Path("../app/bbox-manipulator-backend/assets/poses.json")
PDDL_DIR = Path("../pddl/init_state_id_verified")
OUTPUT_PATH = Path("../app/bbox-manipulator-backend/assets/poses_updated.json")

# Constants
TABLE_HEIGHT = 0.0
RELEVANT_PREDICATES = {"closed", "open", "on", "ontable", "in"}

# Load poses
with open(POSES_PATH, "r") as f:
    poses_data = json.load(f)

# Parse init block from PDDL file
def parse_init_block(lines):
    in_init = False
    init_lines = []
    for line in lines:
        line = line.strip()
        if line.startswith("(:init"):
            in_init = True
            line = line[len("(:init"):].strip()
        if in_init:
            line = line.strip()
            # if line.endswith(")"):
            if line != ")" and line:
                init_lines.append(line.rstrip("()"))
            elif not line:
                continue
            else:
                break
    print(init_lines)

    return [tuple(entry.strip("()").split()) for entry in init_lines]

# Build object state map from init tuples
def build_object_state_map(init_tuples):
    object_states = {}
    for t in init_tuples:
        
        if t[0] in RELEVANT_PREDICATES:
            pred = t[0]
            if len(t) == 2:
                obj = t[1]
                object_states[obj] = (pred,)
            elif len(t) == 3:
                obj, target = t[1], t[2]
                object_states[obj] = (pred, target)
    return object_states

# Main processing
for task in poses_data:
    task_id = task["task_id"]
    pddl_file = PDDL_DIR / f"{task_id}.pddl"
    if not pddl_file.exists():
        print(f"Warning: PDDL file not found for task {task_id}")
        continue

    with open(pddl_file, "r") as f:
        lines = f.readlines()

    init_facts = parse_init_block(lines)
    print(init_facts)
    state_map = build_object_state_map(init_facts)
    id_to_object = {obj["id"]: obj for obj in task["objects"]}

    computed_z = {}

    def compute_z(obj_id):
        if obj_id in computed_z:
            return computed_z[obj_id]

        obj = id_to_object[obj_id]
        obj_height = obj["size"][2]
        if 'container' in obj_id:
            z = 0.
        elif obj_id not in state_map:
            z = obj["position"][2]
        else:
            state = state_map[obj_id]
            if state[0] in {"ontable", "open", "in"}:
                z = TABLE_HEIGHT + 0.5 * obj_height
            elif state[0] in {"on", "closed"}:
                below_id = state[1]
                if below_id not in id_to_object:
                    z = obj["position"][2]
                elif 'container' not in below_id:
                    below_z = compute_z(below_id)
                    below_height = id_to_object[below_id]["size"][2]
                    z = below_z + 0.5 * below_height + 0.5 * obj_height
                else:
                    below_height = id_to_object[below_id]["size"][2]
                    z = TABLE_HEIGHT + below_height + 0.5 * obj_height
            else:
                z = obj["position"][2]

        computed_z[obj_id] = round(z, 3)
        return computed_z[obj_id]

    for obj in task["objects"]:
        obj["position"][2] = compute_z(obj["id"])

# Save the updated poses
with open(OUTPUT_PATH, "w") as f:
    json.dump(poses_data, f, indent=2)

print(f"Updated poses saved to: {OUTPUT_PATH}")
