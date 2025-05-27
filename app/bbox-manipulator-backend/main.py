import json
import math
import os
from typing import List, Dict, Any, Optional, Tuple

import aiofiles
import numpy as np
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# --- Configuration ---
POSES_FILE_PATH = os.path.join(os.path.dirname(__file__), "assets", "poses.json")
TRAJECTORIES_DIR = os.path.join(os.path.dirname(__file__), "trajectories")
IMAGE_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data") # Assuming data is two levels up

# Ensure trajectories directory exists
os.makedirs(TRAJECTORIES_DIR, exist_ok=True)

app = FastAPI()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- Static Files ---
# Mount the directory that contains the actual image data (e.g., rombus_annotation_tool/data)
# The path in poses.json is relative to this mounted path.
# For example, if image_path is "task_1/rgb.png", it will be served from /static_data/task_1/rgb.png
app.mount("/static_data", StaticFiles(directory=IMAGE_DATA_DIR), name="static_data")


# --- Pydantic Models (for request/response validation) ---
class Point(BaseModel):
    x: float
    y: float

class ObjectData(BaseModel):
    id: str
    label: str
    center_x: float
    center_y: float
    width: float
    height: float
    angle_deg: float
    vertices: List[Point]
    ref_dot: Point
    attributes: Dict[str, Any] = {} # Optional attributes

class PlotMetadata(BaseModel):
    plot_width: int
    plot_height: int
    image_width: int
    image_height: int

class SceneDataResponse(BaseModel):
    taskId: str
    originalImageSrc: str
    objects: List[ObjectData]
    plotMetadata: PlotMetadata

class TrajectoryData(BaseModel):
    sceneId: str
    interactionHistory: List[Dict[str, Any]]


# --- Helper Functions ---
def load_poses_data() -> List[Dict[str, Any]]:
    """Loads pose data from the JSON file."""
    try:
        with open(POSES_FILE_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Poses data file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding poses data JSON.")

def calculate_vertices(center_x: float, center_y: float, width: float, height: float, angle_deg: float) -> List[Tuple[float, float]]:
    """
    Calculates the coordinates of the 4 vertices of a rotated rectangle.
    Angle is in degrees.
    Returns a list of (x, y) tuples for the vertices.
    """
    angle_rad = math.radians(angle_deg)
    cos_angle = math.cos(angle_rad)
    sin_angle = math.sin(angle_rad)

    # Half width and half height
    hw = width / 2
    hh = height / 2

    # Coordinates of the 4 corners relative to the center before rotation
    corners = [
        (-hw, -hh),  # Top-left
        (hw, -hh),   # Top-right
        (hw, hh),    # Bottom-right
        (-hw, hh)    # Bottom-left
    ]

    # Rotate and translate corners
    rotated_vertices = []
    for x, y in corners:
        # Rotate
        x_rot = x * cos_angle - y * sin_angle
        y_rot = x * sin_angle + y * cos_angle
        # Translate
        rotated_vertices.append((center_x + x_rot, center_y + y_rot))
    return rotated_vertices

def calculate_ref_dot_from_vertices(vertices: List[Tuple[float, float]]) -> Tuple[float, float]:
    """
    Calculates the reference dot, typically the midpoint of the top-left and top-right vertices.
    """
    if not vertices or len(vertices) < 2:
        return (0, 0) # Should not happen if vertices are calculated correctly
    
    # Assuming vertices are [TL, TR, BR, BL]
    # Ref dot is often the midpoint of the "top" edge (TL-TR)
    # Or sometimes just one of the corners, e.g., the first one (top-left)
    # The original JS code seems to use the first vertex as the reference for dragging.
    # Let's use the midpoint of the first edge (TL-TR) as it's more robust for rotation.
    # If a specific corner is needed, adjust this.
    # The JS frontend logic for `refDot` in `App.js` uses the first vertex for `initialRefDot`.
    # However, for consistency, let's calculate it based on the top edge.
    # The frontend uses the first vertex as the primary handle.
    # Let's stick to the first vertex for simplicity and consistency with the frontend's drag initiation.
    return vertices[0]


# --- API Endpoints ---
@app.get("/api/scenes", response_model=List[Dict[str, Any]])
async def get_all_scenes_list():
    """
    Returns a list of all available scenes/tasks with minimal info.
    """
    poses_data = load_poses_data()
    scene_list = []
    for scene_info in poses_data:
        scene_list.append({
            "taskId": scene_info.get("task_id"),
            "image_path": scene_info.get("image_path"), # Keep original path for reference
            "description": f"Scene for task {scene_info.get('task_id')}" # Basic description
        })
    return scene_list


@app.get("/api/scene/{task_id}", response_model=SceneDataResponse)
async def get_scene_data(task_id: str):
    """
    Fetches scene data for a given task ID.
    """
    poses_data = load_poses_data()
    scene_info = next((item for item in poses_data if item["task_id"] == task_id), None)

    if not scene_info:
        raise HTTPException(status_code=404, detail=f"Scene with task_id '{task_id}' not found.")

    # Construct the full image source URL based on how static files are served
    # The base URL for static files will be something like http://localhost:8000/static_data/
    # The frontend will prepend its own base URL if needed.
    # We provide the path part that comes after /static_data/
    original_image_src = f"/static_data/{scene_info['image_path']}"


    processed_objects: List[ObjectData] = []
    for obj_data in scene_info.get("objects", []):
        center_x = obj_data.get("center_x", 0)
        center_y = obj_data.get("center_y", 0)
        width = obj_data.get("width", 0)
        height = obj_data.get("height", 0)
        angle_deg = obj_data.get("angle_deg", 0)

        raw_vertices = calculate_vertices(center_x, center_y, width, height, angle_deg)
        vertices_pydantic = [Point(x=v[0], y=v[1]) for v in raw_vertices]
        
        ref_dot_raw = calculate_ref_dot_from_vertices(raw_vertices)
        ref_dot_pydantic = Point(x=ref_dot_raw[0], y=ref_dot_raw[1])

        processed_objects.append(
            ObjectData(
                id=obj_data.get("id", "unknown"),
                label=obj_data.get("label", "unknown"),
                center_x=center_x,
                center_y=center_y,
                width=width,
                height=height,
                angle_deg=angle_deg,
                vertices=vertices_pydantic,
                ref_dot=ref_dot_pydantic,
                attributes=obj_data.get("attributes", {})
            )
        )
    
    # plotMetadata should ideally come from the image or be configurable
    # Using placeholders for now, assuming frontend might override or use these.
    # The original JS backend didn't explicitly send these, frontend might calculate them.
    # For now, let's send some defaults. The frontend App.js has constants for these.
    # IMAGE_WIDTH, IMAGE_HEIGHT, PLOT_WIDTH, PLOT_HEIGHT
    # These should ideally be derived from the actual image dimensions if possible,
    # or taken from a configuration.
    # The original JS code in App.js has:
    # const IMAGE_WIDTH = 1024;
    # const IMAGE_HEIGHT = 768;
    # const PLOT_WIDTH = 800;
    # const PLOT_HEIGHT = 600;
    plot_metadata = PlotMetadata(
        plot_width=800,  # Default, frontend might adjust
        plot_height=600, # Default, frontend might adjust
        image_width=scene_info.get("image_width", 1024), # Get from poses or default
        image_height=scene_info.get("image_height", 768) # Get from poses or default
    )

    return SceneDataResponse(
        taskId=task_id,
        originalImageSrc=original_image_src,
        objects=processed_objects,
        plotMetadata=plot_metadata
    )


@app.post("/api/scene/{scene_id}/save_trajectory")
async def save_trajectory_data(scene_id: str, trajectory_data: TrajectoryData = Body(...)):
    """
    Saves interaction trajectory data for a given scene ID.
    """
    if trajectory_data.sceneId != scene_id:
        raise HTTPException(status_code=400, detail="Scene ID in path and body do not match.")

    file_name = f"trajectory_{scene_id}.json"
    file_path = os.path.join(TRAJECTORIES_DIR, file_name)

    try:
        async with aiofiles.open(file_path, 'w') as f:
            # Pydantic models have a .model_dump_json() method
            await f.write(trajectory_data.model_dump_json(indent=2))
        return {"message": f"Trajectory for scene {scene_id} saved successfully.", "filePath": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save trajectory: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Make sure to run this from the `bbox-manipulator-backend-python` directory
    # Example: python main.py
    # The host "0.0.0.0" makes it accessible from other devices on the network
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
