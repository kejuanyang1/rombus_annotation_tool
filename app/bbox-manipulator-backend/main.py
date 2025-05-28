from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body 
from pydantic import BaseModel
import json
import os
from typing import List, Dict, Any


app = FastAPI()

# Allow CORS for frontend interaction
origins = [
    "http://localhost:5173",  # Adjust if your frontend runs on a different port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "../..", "data")
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")
POSES_FILE = os.path.join(ASSETS_DIR, "poses.json")
PDDL_DIR = os.path.join(os.path.dirname(__file__), "../..", "pddl/init_state_id_verified")

FIXED_BOWL_TO_LID_MAP = {
    "container_07": "lid_01",  # blue bowl -> blue lid
    "container_08": "lid_02",  # orange bowl -> orange lid
    "container_09": "lid_03",  # green bowl -> green lid
    "container_10": "lid_04",  # pink bowl -> pink lid
}

app.mount("/images", StaticFiles(directory=DATA_DIR))


def load_all_scene_ids():
    """Loads all task_ids from the poses.json file."""
    if not os.path.exists(POSES_FILE):
         raise HTTPException(status_code=500, detail=f"Poses file not found at {POSES_FILE}")
    try:
        with open(POSES_FILE, "r") as f:
            all_data = json.load(f)
        return sorted([data['task_id'] for data in all_data])
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding poses JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading scene IDs: {e}")


# --- Data Loading ---
def load_scene_data(scene_id: str):
    """Loads scene data from a JSON file."""
    try:
        all_data = []
        with open(f"assets/poses.json", "r") as f:
            all_data = json.load(f)
        for data in all_data:
            if data['task_id'] == scene_id:
                return data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Scene not found")

def load_pddl_data(scene_id: str):
    """Loads and parses PDDL data (simplified for 'on', 'in', 'closed')."""
    pddl_file = os.path.join(PDDL_DIR, f"{scene_id}.pddl")
    relations = {"on": [], "in": [], "closed": []} 

    if not os.path.exists(pddl_file):
        return relations  # Return empty if PDDL not found

    with open(pddl_file, "r") as f:
        in_init_section = False
        for line in f:
            line = line.strip()
            if "(:init" in line:
                in_init_section = True
            elif in_init_section and line.startswith("(on "):
                parts = line.replace("(", "").replace(")", "").split()
                relations["on"].append({"obj1": parts[1], "obj2": parts[2]})
            elif in_init_section and line.startswith("(in "):
                parts = line.replace("(", "").replace(")", "").split()
                relations["in"].append({"obj1": parts[1], "obj2": parts[2]})
            elif in_init_section and line.startswith("(closed "): # Parse closed
                parts = line.replace("(", "").replace(")", "").split()
                relations["closed"].append({"obj1": parts[1]})
            elif in_init_section and line == ")":
                break  # End of init section

    return relations

def transform_pddl_for_frontend(raw_pddl_relations: Dict, bowl_to_lid_map: Dict):
    """
    Transforms raw PDDL relations for frontend consumption.
    If a lid is on its mapped bowl, the bowl is 'closed', and this 'on' is not sent.
    """
    frontend_pddl = {"on": [], "in": [], "closed": []}
    
    frontend_pddl["in"] = raw_pddl_relations.get("in", [])
    
    # Process 'on' relations:
    for on_relation in raw_pddl_relations.get("on", []):
        lid_candidate_id = on_relation["obj1"]
        bowl_candidate_id = on_relation["obj2"]

        # Check if this is a lid on its designated bowl
        if bowl_candidate_id in bowl_to_lid_map and bowl_to_lid_map[bowl_candidate_id] == lid_candidate_id:
            # This bowl is closed by its lid. Add to 'closed' list.
            if not any(c["obj1"] == bowl_candidate_id for c in frontend_pddl["closed"]):
                frontend_pddl["closed"].append({"obj1": bowl_candidate_id})
            # Do NOT add this specific 'on' relation to the frontend's 'on' list.
        else:
            # It's a regular 'on' relation (not a mapped lid closing its bowl)
            frontend_pddl["on"].append(on_relation)
            
    # Add any other items that were explicitly 'closed' in the PDDL
    # (e.g., other types of containers, or bowls closed by non-standard means)
    for closed_relation in raw_pddl_relations.get("closed", []):
        if not any(c["obj1"] == closed_relation["obj1"] for c in frontend_pddl["closed"]):
            frontend_pddl["closed"].append(closed_relation)
            
    # Ensure uniqueness in closed list
    frontend_pddl["closed"] = [dict(t) for t in {tuple(d.items()) for d in frontend_pddl["closed"]}]

    return frontend_pddl


def generate_pddl_string(scene_id: str, pddl_relations: Dict, objects: List[Dict]):
    """Generates a PDDL string from the PDDL relations and objects."""
    pddl_string = f"(define (problem {scene_id}-goal)\n"  # Changed problem name
    pddl_string += "  (:domain gripper-strips)\n"
    pddl_string += "  (:objects\n"

    object_lines = []
    for obj in objects:
        object_lines.append(f"    {obj['id']} - {obj['category']}")
    pddl_string += "\n".join(object_lines)
    pddl_string += "\n  )\n"
    pddl_string += "  (:init\n"

    for relation in pddl_relations.get("on", []):
        pddl_string += f"    (on {relation['obj1']} {relation['obj2']})\n"
    for relation in pddl_relations.get("in", []):
        pddl_string += f"    (in {relation['obj1']} {relation['obj2']})\n"
    for relation in pddl_relations.get("closed", []):
        pddl_string += f"    (closed {relation['obj1']})\n"

    pddl_string += "  )\n"
    pddl_string += "  (:goal\n"
    pddl_string += "    (and\n"
    pddl_string += "      ;; Add goal conditions here\n"
    pddl_string += "    )\n"
    pddl_string += "  )\n"
    pddl_string += ")\n"
    return pddl_string


# --- API Endpoints ---
@app.get("/scenes")
async def get_scenes_list():
    """Endpoint to get the list of all scene IDs."""
    scene_ids = load_all_scene_ids()
    return {"scene_ids": scene_ids}

@app.get("/scene/{scene_id}")
async def get_scene(scene_id: str):
    """Endpoint to get scene data and PDDL relations."""
    scene_data = load_scene_data(scene_id)
    pddl_relations = load_pddl_data(scene_id)
    frontend_pddl = transform_pddl_for_frontend(pddl_relations, FIXED_BOWL_TO_LID_MAP)
    return {"scene": scene_data, "pddl": frontend_pddl, "bowl_to_lid_map": FIXED_BOWL_TO_LID_MAP}


class TrajectoryData(BaseModel):
    trajectory: list
    pddl: Dict

@app.post("/save_trajectory/{scene_id}")
async def save_trajectory(scene_id: str, data: TrajectoryData = Body(...)):
    """Endpoint to save the interaction trajectory."""
    filename = f"trajectories/{scene_id}.json"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        json.dump(data.trajectory, f, indent=4)

    # Save PDDL
    scene_data = load_scene_data(scene_id)
    pddl_string = generate_pddl_string(scene_id, data.pddl, scene_data["objects"])
    pddl_filename = f"pddl/{scene_id}.pddl"
    with open(pddl_filename, "w") as f:
        f.write(pddl_string)

    return {"message": "Trajectory saved successfully"}