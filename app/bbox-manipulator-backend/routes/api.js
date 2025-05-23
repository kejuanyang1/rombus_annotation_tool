const express = require('express');
const fs = require('fs').promises; // Using promises version of fs
const path = require('path');
const router = express.Router();

// Path to your poses.json - adjust if necessary
const POSES_FILE_PATH = path.join(__dirname, '..', 'assets', 'poses.json');
// Path to where trajectories will be saved
const TRAJECTORIES_DIR = path.join(__dirname, '..', 'trajectories');


// Ensure trajectories directory exists
(async () => {
    try {
        await fs.mkdir(TRAJECTORIES_DIR, { recursive: true });
    } catch (error) {
        console.error("Error creating trajectories directory:", error);
    }
})();


let posesData = null;

async function loadPosesData() {
    if (!posesData) {
        try {
            const data = await fs.readFile(POSES_FILE_PATH, 'utf8');
            posesData = JSON.parse(data);
        } catch (error) {
            console.error("Error loading poses.json:", error);
            throw new Error("Could not load poses data.");
        }
    }
    return posesData;
}

// Endpoint to get scene data by task_id (index)
router.get('/scene/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        const allPoses = await loadPosesData();
        const scene = allPoses.find(p => p.task_id === taskId);

        if (!scene) {
            return res.status(404).json({ message: 'Scene not found' });
        }

        // The Python script generates verts. We pass this structure.
        // It also generates a concatenated image.
        const sceneImagePath = `/images/scene_${taskId}_rgb.png`; // Relative path for client

        // We need to provide information for the frontend to correctly map
        // data coordinates to pixel coordinates on the *plotted part* of the image.
        // This requires knowing the dimensions of `top_img` and the axis limits
        // used by matplotlib when `top_img` was saved.
        // For simplicity, assuming the python script can output this metadata alongside images,
        // or we make assumptions. For now, just sending basic data.
        // Frontend will need: task_id, sceneImagePath, objects with their initial state.

        const objects = scene.objects.map(obj => {
            const rad = Math.radians(obj.orientation);
            const cs = Math.cos(-rad);
            const sn = Math.sin(-rad);
            const sx = obj.size[0];
            const sy = obj.size[1];

            const s_half_proj_y = sy / 2 * sn; // Python's dx_x
            const s_half_proj_x = sy / 2 * cs; // Python's dx_y

            const w_half_proj_y = -sx / 2 * cs; // Python's dy_x
            const w_half_proj_x = sx / 2 * sn;  // Python's dy_y

            // obj.position is [x, y, _] (scene_x_center, scene_y_center)
            // Vertices are (plot_y, plot_x)
            const verts = [
                [obj.position[1] - s_half_proj_y - w_half_proj_y, obj.position[0] - s_half_proj_x - w_half_proj_x],
                [obj.position[1] + s_half_proj_y - w_half_proj_y, obj.position[0] + s_half_proj_x - w_half_proj_x],
                [obj.position[1] + s_half_proj_y + w_half_proj_y, obj.position[0] + s_half_proj_x + w_half_proj_x],
                [obj.position[1] - s_half_proj_y + w_half_proj_y, obj.position[0] - s_half_proj_x + w_half_proj_x],
            ];

            const groups = obj.id.split("_");
            const label = obj.name + (groups.length === 3 ? `_${groups[groups.length - 1]}` : "");

            return {
                id: obj.id,
                name: obj.name, // e.g., "bowl", "lid"
                label: label,
                // Initial state for rendering and physics:
                scene_x: obj.position[0], // Center x (down+)
                scene_y: obj.position[1], // Center y (right+)
                size_sx: obj.size[0],     // Width in object's frame
                size_sy: obj.size[1],     // Height in object's frame
                orientation: obj.orientation, // Degrees
                initial_verts: verts // Calculated vertices [plot_y, plot_x]
            };
        });

        // You might need to send axis limits (min_x, max_x, min_y, max_y of the plot)
        // and the dimensions of the top (plotted) part of the image if they vary.
        // Example:
        const plotMetadata = {
           plot_target_width: 600, // top_img.width from your script (example)
           plot_target_height: 400, // top_img.height from your script (example)
        };

        res.json({
            taskId: scene.task_id,
            originalImageSrc: sceneImagePath,
            objects: objects,
            plotMetadata: plotMetadata // Send this if available
        });

    } catch (error) {
        console.error(`Error fetching scene ${taskId}:`, error);
        res.status(500).json({ message: 'Error fetching scene data', error: error.message });
    }
});

// Endpoint to save interaction trajectory
router.post('/scene/:sceneId/save_trajectory', async (req, res) => {
    const { sceneId } = req.params;
    const trajectoryData = req.body; // Expects JSON data

    if (!trajectoryData) {
        return res.status(400).json({ message: 'No trajectory data provided' });
    }

    const filePath = path.join(TRAJECTORIES_DIR, `${sceneId}_traj.json`);

    try {
        await fs.writeFile(filePath, JSON.stringify(trajectoryData, null, 2));
        res.status(200).json({ message: `Trajectory saved to ${filePath}` });
    } catch (error) {
        console.error(`Error saving trajectory for scene ${sceneId}:`, error);
        res.status(500).json({ message: 'Error saving trajectory' });
    }
});

// Helper for Math.radians if not available globally
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

module.exports = router;