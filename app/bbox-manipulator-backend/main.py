from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

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
PDDL_DIR = "/Users/ykj/Desktop/github/ROMBUS/planner/instances/init_state_id/"

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
    """Loads and parses PDDL data (simplified for 'on', 'in', 'open', 'closed')."""
    pddl_file = os.path.join(PDDL_DIR, f"{scene_id}.pddl")
    relations = {"on": [], "in": [], "open": [], "closed": []} # Include open and closed

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
            elif in_init_section and line.startswith("(open "): # Parse open
                parts = line.replace("(", "").replace(")", "").split()
                relations["open"].append({"obj1": parts[1]})
            elif in_init_section and line.startswith("(closed "): # Parse closed
                parts = line.replace("(", "").replace(")", "").split()
                relations["closed"].append({"obj1": parts[1]})
            elif in_init_section and line == ")":
                break  # End of init section

    return relations

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
    return {"scene": scene_data, "pddl": pddl_relations}

@app.post("/save_trajectory/{scene_id}")
async def save_trajectory(scene_id: str, trajectory: list):
    """Endpoint to save the interaction trajectory."""
    filename = f"trajectories/{scene_id}.json"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        json.dump(trajectory, f, indent=4)
    return {"message": "Trajectory saved successfully"}

# --- PDDL Data (Example - you'll need to create these files) ---
# Create a directory named 'pddl_data' and add PDDL files like this:
# pddl_data/01_0.pddl (content as in your example)

# --- Trajectories Directory ---
# Create a directory named 'trajectories' to store saved trajectories.