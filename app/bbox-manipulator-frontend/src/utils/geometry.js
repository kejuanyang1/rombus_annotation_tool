// src/utils/geometry.js

if (!Math.radians) {
    Math.radians = function(degrees) {
      return degrees * Math.PI / 180;
    };
}

export function calculateVertices(scene_center_x, scene_center_y, size_sx, size_sy, orientation_degrees) {
    // scene_center_x: from obj.position[0] (original scene's x, which is down)
    // scene_center_y: from obj.position[1] (original scene's y, which is right)
    // size_sx: object's width in its own frame
    // size_sy: object's height in its own frame

    const rad = Math.radians(orientation_degrees);
    const cs = Math.cos(-rad);
    const sn = Math.sin(-rad);

    const half_obj_height_proj_on_scene_Y = (size_sy / 2) * sn;
    const half_obj_height_proj_on_scene_X = (size_sy / 2) * cs;

    const half_obj_width_proj_on_scene_Y = (-size_sx / 2) * cs;
    const half_obj_width_proj_on_scene_X = (size_sx / 2) * sn;

    const verts = [
        [ // Vertex 0: [scene_y_coord, scene_x_coord]
            scene_center_y - half_obj_height_proj_on_scene_Y - half_obj_width_proj_on_scene_Y,  // scene y-coordinate
            scene_center_x - half_obj_height_proj_on_scene_X - half_obj_width_proj_on_scene_X  // scene x-coordinate
        ],
        [ // Vertex 1
            scene_center_y + half_obj_height_proj_on_scene_Y - half_obj_width_proj_on_scene_Y,
            scene_center_x + half_obj_height_proj_on_scene_X - half_obj_width_proj_on_scene_X
        ],
        [ // Vertex 2
            scene_center_y + half_obj_height_proj_on_scene_Y + half_obj_width_proj_on_scene_Y,
            scene_center_x + half_obj_height_proj_on_scene_X + half_obj_width_proj_on_scene_X
        ],
        [ // Vertex 3
            scene_center_y - half_obj_height_proj_on_scene_Y + half_obj_width_proj_on_scene_Y,
            scene_center_x - half_obj_height_proj_on_scene_X + half_obj_width_proj_on_scene_X
        ]
    ];
    return verts; // Returns array of [scene_y_data, scene_x_data] pairs
}