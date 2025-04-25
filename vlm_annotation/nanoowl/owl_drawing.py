# SPDX-FileCopyrightText: Copyright (c) 2023 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import PIL.Image
import PIL.ImageDraw
import cv2
from .owl_predictor import OwlDecodeOutput
import matplotlib.pyplot as plt
import numpy as np
from typing import List
import logging
import time

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

stable_candidates = {}

def get_colors(count: int):
    cmap = plt.cm.get_cmap("pink", count)
    colors = []
    for i in range(count):
        color = cmap(i)
        color = [int(255 * value) for value in color]
        colors.append(tuple(color))
    return colors

def filter_detections_by_query(output: OwlDecodeOutput, query_texts: List[str]) -> List[int]:
    """
    For each unique query text, if it appears only once in query_texts,
    use temporal stability to pick a candidate detection.
    
    For queries that appear multiple times, we use spatial ordering.
    
    Returns a list of detection indices to be drawn.
    """
    global stable_candidates
    # Build a mapping from query text to list of its occurrence indices.
    query_occurrences = {}
    for idx, q in enumerate(query_texts):
        query_occurrences.setdefault(q, []).append(idx)
    
    selected_indices = []
    num_detections = len(output.labels)
    
    for q_text, occ_list in query_occurrences.items():
        required_count = len(occ_list)
        # Gather candidate indices: those i where the detection label is in occ_list.
        candidates = [i for i in range(num_detections) if int(output.labels[i]) in occ_list]
        if not candidates:
            continue

        if required_count == 1:
            # For a single-occurrence query, try to choose the candidate that's closest
            # to the previously selected candidate for this query (if available).
            THRESHOLD = 50.0  # pixels
            candidate_info = []  # Each element: (candidate index, center tuple, confidence)
            for i in candidates:
                box = output.boxes[i]
                center = ((box[0] + box[2]) / 2.0, (box[1] + box[3]) / 2.0)
                conf = float(output.scores[i])
                candidate_info.append((i, center, conf))
            if q_text in stable_candidates:
                prev_index, prev_center, prev_conf = stable_candidates[q_text]
                # Find the candidate whose center is closest to prev_center.
                best_candidate = min(candidate_info, key=lambda t: ((t[1][0] - prev_center[0])**2 + (t[1][1] - prev_center[1])**2)**0.5)
                dist = ((best_candidate[1][0] - prev_center[0])**2 + (best_candidate[1][1] - prev_center[1])**2)**0.5
                if dist < THRESHOLD:
                    selected_index = best_candidate[0]
                else:
                    # If none is close enough, choose the one with the highest confidence.
                    best_candidate = max(candidate_info, key=lambda t: t[2])
                    selected_index = best_candidate[0]
            else:
                # No previous candidate—choose the one with the highest confidence.
                best_candidate = max(candidate_info, key=lambda t: t[2])
                selected_index = best_candidate[0]
            # Update the stable candidate info for this query.
            box = output.boxes[selected_index]
            center = ((box[0] + box[2]) / 2.0, (box[1] + box[3]) / 2.0)
            conf = float(output.scores[selected_index])
            stable_candidates[q_text] = (selected_index, center, conf)
            selected_indices.append(selected_index)
        else:
            # For queries that appear multiple times, use spatial ordering.
            candidates_sorted = sorted(candidates, key=lambda i: ((output.boxes[i][0] + output.boxes[i][2]) / 2))
            selected = candidates_sorted[:required_count]
            selected_indices.extend(selected)
    
    return selected_indices



# def draw_axes(image, origin=(50, 50), axis_length=100, color=(0, 255, 0), thickness=2):
#     """
#     Draws x and y axes on the image starting from a given origin.
    
#     Args:
#         image (np.ndarray): The image on which to draw.
#         origin (tuple): (x,y) coordinates of the origin point.
#         axis_length (int): Length of each axis in pixels.
#         color (tuple): Color for the axes (B,G,R).
#         thickness (int): Line thickness.
        
#     Returns:
#         The image with axes drawn.
#     """
#     # Draw x-axis: from origin to (origin.x + axis_length, origin.y)
#     cv2.line(image, origin, (origin[0] + axis_length, origin[1]), color, thickness)
#     # Draw y-axis: from origin to (origin.x, origin.y + axis_length)
#     cv2.line(image, origin, (origin[0], origin[1] + axis_length), color, thickness)
    
#     # Label the axes
#     cv2.putText(image, "y", (origin[0] + axis_length - 15, origin[1] - 10),
#                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2, cv2.LINE_AA)
#     cv2.putText(image, "x", (origin[0] - 25, origin[1] + axis_length),
#                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2, cv2.LINE_AA)
    
#     return image

def draw_rotated_label(image, text, textOrg, angle, font=cv2.FONT_HERSHEY_SIMPLEX,
                       font_scale=1, thickness=2, color=(0, 0, 255)):
    # Create a blank overlay with the same size and 3 channels (black background)
    overlay = np.zeros_like(image)
    
    # Compute text size and baseline
    (text_w, text_h), baseline = cv2.getTextSize(text, font, font_scale, thickness)
    # Adjust the text position so that the text is centered at textOrg
    textPos = (textOrg[0] - text_w // 2, textOrg[1] + text_h // 2)
    
    # Draw the text on the overlay (only text, background remains black)
    cv2.putText(overlay, text, textPos, font, font_scale, color, thickness, cv2.LINE_AA)
    
    # Define the center of rotation – here we use textOrg as the center
    center = textOrg
    # Get the rotation matrix; note that angle is in degrees (positive rotates counterclockwise)
    M = cv2.getRotationMatrix2D(center, angle, 1)
    
    # Apply warpAffine to rotate the overlay. Since overlay and image share the same dimensions,
    # no additional conversion is necessary.
    rotated_overlay = cv2.warpAffine(overlay, M, (image.shape[1], image.shape[0]),
                                     flags=cv2.INTER_LINEAR,
                                     borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))
    
    # Add the rotated overlay to the original image. This simple addition works well
    # if the overlay’s black pixels (value [0,0,0]) don't interfere with your image.
    image_with_label = cv2.add(image, rotated_overlay)
    return image_with_label

def draw_axes(image, axis_length=100, color=(0, 255, 0), thickness=2):
    """
    Draws x and y axes in the bottom-right corner of the image.
    x-axis extends to the left, y-axis extends upward.
    
    Args:
        image (np.ndarray): The image (BGR) on which to draw.
        axis_length (int): Length of each axis in pixels.
        color (tuple): Color for the axes (B, G, R).
        thickness (int): Line thickness.
        
    Returns:
        The image with axes drawn.
    """
    h, w = image.shape[:2]
    
    # Pick a small margin so the axes don't touch the very edge
    margin = 20
    origin = (w - margin, h - margin)
    
    # Draw the x-axis (from origin going left)
    cv2.line(
        image,
        origin,
        (origin[0] - axis_length, origin[1]),
        color,
        thickness
    )

    textOrg_y = (origin[0]- axis_length - 15, origin[1] + 5)
    
    # Rotate by -90 or 90 depending on how you want it oriented
    image = draw_rotated_label(
        image=image,
        text="y",
        textOrg=textOrg_y,
        angle=180,  # adjust sign as needed
        font=cv2.FONT_HERSHEY_SIMPLEX,
        font_scale=0.7,
        thickness=2,
        color=color
    )

    # For "x" label, place it near the left end of the x-axis
    textOrg_x = (origin[0] - 10, origin[1] - axis_length )
    image = draw_rotated_label(
        image=image,
        text="x",
        textOrg=textOrg_x,
        angle=180,  # or any angle you like, e.g., 180 for upside down
        font=cv2.FONT_HERSHEY_SIMPLEX,
        font_scale=0.7,
        thickness=2,
        color=color
    )
    


    # Draw the y-axis (from origin going up)
    cv2.line(
        image,
        origin,
        (origin[0], origin[1] - axis_length),
        color,
        thickness
    )
    
    # # Label the axes:
    # #   "x" near the left end of x-axis,
    # #   "y" near the top end of y-axis.
    # cv2.putText(
    #     image,
    #     "y",
    #     (origin[0] - axis_length - 15, origin[1] + 5),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.7,
    #     color,
    #     2,
    #     cv2.LINE_AA
    # )
    # cv2.putText(
    #     image,
    #     "x",
    #     (origin[0] - 15, origin[1] - axis_length - 10),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.7,
    #     color,
    #     2,
    #     cv2.LINE_AA
    # )
    
    return image





def draw_owl_output(image, output: OwlDecodeOutput, text: List[str], draw_text=True):
    is_pil = not isinstance(image, np.ndarray)
    
    if is_pil:
        image = np.ascontiguousarray(image).copy() 

    # Get image dimensions
    img_h, img_w = image.shape[:2]

    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 1.0
    # num_detections = len(output.labels)
    selected_indices = filter_detections_by_query(output, text)


    for i in selected_indices:
        box = output.boxes[i]
        label_index = int(output.labels[i])
        box = [int(x) for x in box]
        pt0 = (box[0], box[1])  # top-left
        pt1 = (box[2], box[3])  # bottom-right

        # ---------------------------------------------------------
        # 1) Check if bounding box is nearly as big as the entire frame
        # ---------------------------------------------------------
        bbox_width = pt1[0] - pt0[0]
        bbox_height = pt1[1] - pt0[1]

        # For example, skip if w/h are >80% of image w/h:
        if (bbox_width >= 0.8 * img_w) and (bbox_height >= 0.8 * img_h):
            # Skip this detection entirely
            continue

        # If you want to check by area instead, you could do:
        #   bbox_area = bbox_width * bbox_height
        #   img_area = img_w * img_h
        #   if bbox_area >= 0.8 * img_area:
        #       continue

        # If not skipped, draw the detection
        cv2.rectangle(
            image,
            pt0,
            pt1,
            (255, 255, 255),
            4
        )

        if draw_text:
            offset_y = 10
            offset_x = 140
            label_text = text[label_index]

            text_origin = (box[0] + offset_x, box[1] + offset_y)

            # Draw the label text
            image = draw_rotated_label(
            image=image,
            text=label_text,
            textOrg=text_origin,
            angle=0,
            font=font,
            font_scale=font_scale,
            thickness=2,  # Adjust font size if needed
            color=(255, 255, 255)  # White color (B, G, R)
    )
    image = draw_axes(image, axis_length=100)
    if is_pil:
        image = PIL.Image.fromarray(image)

    return image
