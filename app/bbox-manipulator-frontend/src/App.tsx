import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Rect, Transformer, Text, Group, Line } from 'react-konva';
import Konva from 'konva';
import './App.css'; // Import the CSS file

// --- Interfaces ---
interface ObjectData {
  id: string;
  name: string;
  category: string;
  position: [number, number, number]; // [world_x_vertical_CENTER, world_y_horizontal_CENTER, world_z_CENTER]
  orientation: number;
  size: [number, number, number]; // [world_depth_vertical_SIZE, world_width_horizontal_SIZE, world_height_z_SIZE]
}

interface SceneData {
  task_id: string;
  objects: ObjectData[];
  obj_ids?: string[];
  category?: string[]; // Main category of the scene
  quantity?: number;
}

type ActionType = 'SELECT' | 'PUT_NEAR' | 'PUT_IN' | 'PUT_ON' | 'OPEN' | 'CLOSE' | null;
type ActionState = 'SELECT_TARGET' | 'SELECT_REFERENCE' | 'MANIPULATE';

interface Action {
  type: ActionType;
  objectId: string;
  refObjectId?: string;
  new_pos?: [number, number, number];
  new_orientation?: number;
}

interface BowlToLidMap {
    [bowlId: string]: string;
}

interface PddlSingleObjectRelation {
  obj1: string;
}

interface PddlTwoObjectRelation {
  obj1: string;
  obj2: string;
}

interface PddlRelationsType {
  on: PddlTwoObjectRelation[];
  in: PddlTwoObjectRelation[];
  closed: PddlSingleObjectRelation[];
}

// --- World Coordinate Display Range ---
const WORLD_X_MIN = 0;    // Vertical world axis (obj.position[0]) - min value
const WORLD_X_MAX = 0.5;  // Vertical world axis (obj.position[0]) - max value
const WORLD_Y_MIN = -0.6; // Horizontal world axis (obj.position[1]) - min value
const WORLD_Y_MAX = 0.2;  // Horizontal world axis (obj.position[1]) - max value

const TABLE_HEIGHT = -0.2;

const worldDisplayRangeX = WORLD_X_MAX - WORLD_X_MIN; // Total height (0.5)
const worldDisplayRangeY = WORLD_Y_MAX - WORLD_Y_MIN; // Total width (1.0)

// --- Axis Configuration ---
const TICK_INTERVAL = 0.1; // World units
const AXIS_COLOR = '#888888';
const GRID_COLOR = '#CCCCCC';
const AXIS_WIDTH = 1.5;
const TICK_WIDTH = 1;
const LABEL_FONT_SIZE = 10;
const LABEL_COLOR = '#333333';
const AXIS_PADDING = 30; // Pixels - Increased padding



const App: React.FC = () => {
    // --- State Variables ---
    const [sceneId, setSceneId] = useState<string>('01_0');
    const [sceneList, setSceneList] = useState<string[]>([]);
    const [sceneData, setSceneData] = useState<SceneData | null>(null);
    const [pddlRelations, setPddlRelations] = useState<PddlRelationsType>({ on: [], in: [], closed: [] });
    const [bowlToLidMap, setBowlToLidMap] = useState<BowlToLidMap>({});
    const [trajectory, setTrajectory] = useState<any[]>([]);
    const [currentAction, setCurrentAction] = useState<ActionType>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [referenceId, setReferenceId] = useState<string | null>(null);
    const [actionState, setActionState] = useState<ActionState>('SELECT_TARGET');
    const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 0 });
    const [currentStepAction, setCurrentStepAction] = useState<Action | null>(null);
    const [sceneObjectsBeforeStep, setSceneObjectsBeforeStep] = useState<ObjectData[] | null>(null);
    const [pddlRelationsBeforeStep, setPddlRelationsBeforeStep] = useState<PddlRelationsType | null>(null);


    // --- Konva Refs ---
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const objectsRef = useRef<Map<string, Konva.Group>>(new Map());
    const centerColRef = useRef<HTMLDivElement>(null);

    // --- Update Stage Size ---
     useEffect(() => {
        const updateSize = () => {
            if (centerColRef.current) {
                setStageSize({
                    width: centerColRef.current.offsetWidth,
                    height: centerColRef.current.offsetHeight,
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // --- Calculate Uniform Scale and Offsets ---
    const { worldToCanvasScale, canvasOffsetX, canvasOffsetY } = useMemo(() => {
        if (!stageSize.width || !stageSize.height) return { worldToCanvasScale: 100, canvasOffsetX: AXIS_PADDING, canvasOffsetY: AXIS_PADDING };

        const availableWidth = stageSize.width - 2 * AXIS_PADDING;
        const availableHeight = stageSize.height - 2 * AXIS_PADDING;

        const scaleX = availableHeight / worldDisplayRangeX;
        const scaleY = availableWidth / worldDisplayRangeY;

        const scale = Math.min(scaleX, scaleY);

        const contentW = worldDisplayRangeY * scale;
        const contentH = worldDisplayRangeX * scale;

        const offX = (availableWidth - contentW) / 2 + AXIS_PADDING;
        const offY = (availableHeight - contentH) / 2 + AXIS_PADDING;

        return { worldToCanvasScale: scale, canvasOffsetX: offX, canvasOffsetY: offY };

    }, [stageSize.width, stageSize.height]);


    // --- World to Canvas Conversion ---
    const worldToCanvasX = (worldY: number) => (worldY - WORLD_Y_MIN) * worldToCanvasScale + canvasOffsetX;
    const worldToCanvasY = (worldX: number) => (worldX - WORLD_X_MIN) * worldToCanvasScale + canvasOffsetY;

    // --- Canvas to World Conversion ---
    const canvasToWorldX = (canvasY: number) => ((canvasY - canvasOffsetY) / worldToCanvasScale) + WORLD_X_MIN;
    const canvasToWorldY = (canvasX: number) => ((canvasX - canvasOffsetX) / worldToCanvasScale) + WORLD_Y_MIN;


    // --- Data Loading ---
    useEffect(() => {
        const fetchSceneList = async () => {
            try {
                const response = await fetch('http://localhost:8000/scenes');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setSceneList(data.scene_ids || []);
                if (data.scene_ids && data.scene_ids.length > 0 && !sceneList.includes(sceneId)) {
                   setSceneId(data.scene_ids[0]);
                }
            } catch (error) {
                console.error("Error loading scene list:", error);
                alert("Error loading scene list.");
            }
        };
        fetchSceneList();
    }, []);

    useEffect(() => {
        if (sceneId) {
            loadScene(sceneId);
        }
    }, [sceneId]);

    const loadScene = async (idToLoad: string) => {
        if (!idToLoad) return;
        console.log(`Loading scene: ${idToLoad}`);
        try {
            const response = await fetch(`http://localhost:8000/scene/${idToLoad}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
                throw new Error(`HTTP error! status: ${response.status}, ${errorData.detail}`);
            }
            const data = await response.json();
            setSceneData(data.scene);
            setPddlRelations(data.pddl || { on: [], in: [], closed: [] });
            setBowlToLidMap(data.bowl_to_lid_map || {});
            setTrajectory([]);
            setSelectedId(null);
            setReferenceId(null);
            setCurrentAction(null);
            setActionState('SELECT_TARGET');
            setCurrentStepAction(null);
            setSceneObjectsBeforeStep(null);
            setPddlRelationsBeforeStep(null);
        } catch (error) {
            console.error("Error loading scene:", error);
            alert(`Error loading scene ${idToLoad}: ${error instanceof Error ? error.message : String(error)}`);
            setSceneData(null);
            setPddlRelations({ on: [], in: [], closed: [] });
            setBowlToLidMap({});
        }
    };

    const handleLoadSceneClick = () => loadScene(sceneId);

    const handlePrev = () => {
        const currentIndex = sceneList.indexOf(sceneId);
        if (currentIndex > 0) setSceneId(sceneList[currentIndex - 1]);
    };

    const handleNext = () => {
        const currentIndex = sceneList.indexOf(sceneId);
        if (currentIndex !== -1 && currentIndex < sceneList.length - 1) {
            setSceneId(sceneList[currentIndex + 1]);
        }
    };

    // --- Save Trajectory (Updated) ---
    const saveTrajectory = async () => {
        if (!sceneData) return;
        try {
            await fetch(`http://localhost:8000/save_trajectory/${sceneData.task_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send both trajectory and PDDL relations
                body: JSON.stringify({ trajectory, pddl: pddlRelations }),
            });
            alert('Trajectory and PDDL saved!');
        } catch (error) {
            console.error('Error saving trajectory:', error);
            alert('Error saving trajectory.');
        }
    };

    const getObjectColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'lid': return '#3498DB';
            case 'bowl': return '#2ECC71';
            case 'basket': return '#E67E22';
            case 'support': return '#9B59B6';
            case 'base': return '#ECF0F1';
            case 'item': return '#7F8C8D';
            case 'container': return '#27AE60';
            default: return '#BDC3C7';
        }
    };

   const updateObjectState = (
        objectId: string, // The ID of the object whose state (pos/rot) is changing
        newPos: [number, number, number] | null,
        newOrientation: number | null,
        actionTypeForPddl: ActionType, // The semantic action type for PDDL update
        pddlContextObjectId?: string // The object the action is primarily on/with (e.g., bowl for OPEN/CLOSE)
    ) => {
        if (!currentStepAction && sceneData) {
            setSceneObjectsBeforeStep(sceneData.objects.map(o => ({ ...o })));
            setPddlRelationsBeforeStep(JSON.parse(JSON.stringify(pddlRelations))); // Store PDDL state
        } else if (!sceneData) {
            setSceneObjectsBeforeStep(null);
            setPddlRelationsBeforeStep(null);
        }

        setSceneData(prevData => {
            if (!prevData) return null;
            const updatedObjects = prevData.objects.map(obj => {
                if (obj.id === objectId) {
                    const updatedObj = { ...obj };
                    if (newPos) updatedObj.position = newPos;
                    if (newOrientation !== null) updatedObj.orientation = newOrientation;
                    return updatedObj;
                }
                return obj;
            });
            return { ...prevData, objects: updatedObjects };
        });

        const actualActionTypeForTrajectory = currentAction; // Use the globally set currentAction for trajectory

        if (newPos && newOrientation !== null && actualActionTypeForTrajectory) {
          setCurrentStepAction({
             type: actualActionTypeForTrajectory,
             objectId: objectId, // object being moved for OPEN/CLOSE this is the lid
             refObjectId: pddlContextObjectId ? pddlContextObjectId : (referenceId === null ? undefined : referenceId), // For OPEN/CLOSE, this is the bowl
             new_pos: newPos,
             new_orientation: newOrientation
         });
     } else if (actionTypeForPddl === 'OPEN' || actionTypeForPddl === 'CLOSE') {
          // For OPEN/CLOSE, this block primarily sets the action if the bowl itself isn't moving
          // but an action (like OPEN/CLOSE) is performed on it, causing a related object (lid) to move.
         if (actualActionTypeForTrajectory && pddlContextObjectId) { // pddlContextObjectId is the bowl
              setCurrentStepAction({
                 type: actualActionTypeForTrajectory,
                 objectId: pddlContextObjectId, // Bowl is the primary target of the semantic action
                 refObjectId: objectId, // objectId here is the manipulatedObjId (the lid)
                                        // Type string is assignable to string | undefined, so this is okay.
             });
         }
     }

        updatePddlRelations(objectId, actionTypeForPddl, pddlContextObjectId);

        // --- Layering Logic (Move to Top) ---
        // We move the object to the top *visually* when it's placed ON something.
        // This is handled by a dedicated useEffect hook now.
    };


    useEffect(() => {
        if (trRef.current) {
            const selectedNode = selectedId ? objectsRef.current.get(selectedId) : null;
            if (selectedNode && (currentAction !== null || actionState === 'MANIPULATE')) {
                trRef.current.nodes([selectedNode]);
                trRef.current.enabledAnchors([]);
                trRef.current.rotateEnabled(true);
            } else {
                trRef.current.nodes([]);
            }
            trRef.current.getLayer()?.batchDraw();
        }
    }, [selectedId, currentAction, actionState]);

    // --- New useEffect for Layering ---
    useEffect(() => {
        const bringToTop = (objectId: string) => {
            if (objectsRef.current.has(objectId)) {
                objectsRef.current.get(objectId)?.moveToTop();
            }
        };

        // Bring objects 'on' top
        pddlRelations.on.forEach(relation => bringToTop(relation.obj1));

        // Bring 'closed' lids on top
        pddlRelations.closed.forEach(relation => {
            const lidId = bowlToLidMap[relation.obj1];
            if (lidId) {
                bringToTop(lidId);
            }
        });

        // Redraw the layer to reflect changes
        layerRef.current?.batchDraw();

    }, [pddlRelations, bowlToLidMap, sceneData]); // Rerun when PDDL, map or sceneData changes


    const constrainedDrag = (pos: { x: number; y: number }) => {
        if (!dragStartPos || currentAction !== 'PUT_NEAR' || actionState !== 'MANIPULATE') return pos;
        const dx = Math.abs(pos.x - dragStartPos.x);
        const dy = Math.abs(pos.y - dragStartPos.y);
        return dx > dy ? { x: pos.x, y: dragStartPos.y } : { x: dragStartPos.x, y: pos.y };
    };

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === e.target.getStage()) {
            setSelectedId(null);
            setReferenceId(null);
            setActionState('SELECT_TARGET');
            // setCurrentAction(null); // Do not nullify current action here, allow selection then action
        }
    };

    const handleObjectClick = (objData: ObjectData, e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.stopPropagation();
        const clickedObjectId = objData.id;
        if (currentAction === null) return;

        if (actionState === 'SELECT_TARGET') {
            setSelectedId(clickedObjectId);

            if (currentAction === 'OPEN') {
                if (!bowlToLidMap || !sceneData || !pddlRelations) {
                    alert("Scene data, bowl-lid map, or PDDL relations not loaded.");
                    setCurrentAction(null); return;
                }
                const bowlId = clickedObjectId;
                const lidId = bowlToLidMap[bowlId];

                if (!lidId) {
                    alert("This bowl does not have a mapped lid for the 'OPEN' action.");
                    setCurrentAction(null); setSelectedId(null); return;
                }
                const lidObject = sceneData.objects.find(o => o.id === lidId);
                if (!lidObject) {
                    alert(`Lid object with ID ${lidId} not found.`);
                    setCurrentAction(null); setSelectedId(null); return;
                }

                const isBowlClosed = pddlRelations.closed.some(r => r.obj1 === bowlId);
                if (!isBowlClosed) {
                    alert("Cannot open: Bowl is not closed.");
                    setCurrentAction(null); setSelectedId(null); return;
                }

                const bowlObject = sceneData.objects.find(o => o.id === bowlId)!;
                // Move lid slightly away (e.g., shift by its own width in Y from the bowl's edge)
                 const newLidPos: [number, number, number] = [
                    bowlObject.position[0] + 0.03, // example offset
                    bowlObject.position[1],
                    bowlObject.position[2] - bowlObject.size[2]/2 + lidObject.size[2]/2 // Table
                ];
                updateObjectState(lidId, newLidPos, lidObject.orientation, 'OPEN', bowlId);

            } else if (currentAction === 'CLOSE') {
                if (!bowlToLidMap || !sceneData || !pddlRelations) {
                    alert("Scene data, bowl-lid map, or PDDL relations not loaded.");
                    setCurrentAction(null); return;
                }
                const bowlId = clickedObjectId;
                const lidId = bowlToLidMap[bowlId];

                if (!lidId) {
                    alert("This bowl does not have a mapped lid for the 'CLOSE' action.");
                    setCurrentAction(null); setSelectedId(null); return;
                }
                 const lidObject = sceneData.objects.find(o => o.id === lidId);
                if (!lidObject) {
                    alert(`Lid object with ID ${lidId} not found.`);
                    setCurrentAction(null); setSelectedId(null); return;
                }

                const isBowlClosed = pddlRelations.closed.some(r => r.obj1 === bowlId);
                if (isBowlClosed) {
                    alert("Cannot close: Bowl is already closed.");
                    setCurrentAction(null); setSelectedId(null); return;
                }

                const bowlObject = sceneData.objects.find(o => o.id === bowlId)!;
                // Position lid on top of the bowl
                const newLidPos: [number, number, number] = [
                    bowlObject.position[0],
                    bowlObject.position[1],
                    bowlObject.position[2] + (bowlObject.size[2]/2) + (lidObject.size[2]/2) // Assuming Z is center
                ];
                updateObjectState(lidId, newLidPos, bowlObject.orientation, 'CLOSE', bowlId);
            } else {
                setActionState('SELECT_REFERENCE');
            }
        } else if (actionState === 'SELECT_REFERENCE' && clickedObjectId !== selectedId) {
            setReferenceId(clickedObjectId);
            const targetObj = sceneData?.objects.find(o => o.id === selectedId); // item to move
            const refObj = sceneData?.objects.find(o => o.id === clickedObjectId); // destination/surface

            if (targetObj && refObj) {
                const [refX, refY, refZ] = refObj.position;

                if (currentAction === 'PUT_IN' && refObj.category === "container") {
                    const isContainerClosed = pddlRelations.closed.some(r => r.obj1 === refObj.id);
                    if (isContainerClosed) {
                        alert("Cannot put item in: The container is closed.");
                        // Reset selection, or handle as needed
                        setSelectedId(null);
                        setReferenceId(null);
                        setActionState('SELECT_TARGET');
                        return; // Prevent the action
                    }
                    updateObjectState(selectedId!, [refX, refY, refZ - refObj.size[2]/2 + targetObj.size[2]/2], 0, currentAction, clickedObjectId);
                } else if (currentAction === 'PUT_ON' && refObj.category !== "container") {
                    const newTargetZ = refZ + (refObj.size[2]/2) + (targetObj.size[2]/2);
                    updateObjectState(selectedId!, [refX, refY, newTargetZ], 0, currentAction, clickedObjectId);
                } else if (currentAction === 'PUT_NEAR') {
                    setActionState('MANIPULATE'); // Enter drag/rotate mode
                    // Initial position for PUT_NEAR might be set here if needed, or rely on drag.
                    // For now, we let drag handle the final position for PUT_NEAR.
                    return;
                }
                 // For PUT_IN and PUT_ON, action is completed by selecting reference if valid
            }
        }
    };


    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (actionState === 'MANIPULATE' && currentAction !== null) {
            if (referenceId && objectsRef.current.has(referenceId)) {
                const referenceNode = objectsRef.current.get(referenceId);
                if (referenceNode) {
                    setDragStartPos({ x: referenceNode.x(), y: referenceNode.y() });
                } else {
                    setDragStartPos({ x: e.target.x(), y: e.target.y() });
                }
            } else {
                setDragStartPos({ x: e.target.x(), y: e.target.y() });
            }
             // Bring dragged object to top during drag
            e.target.moveToTop();
            layerRef.current?.batchDraw();
        } else {
            setDragStartPos(null);
        }
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
        if (currentAction === null || actionState !== 'MANIPULATE') return; // Only allow drag for MANIPULATE state
        const node = e.target as Konva.Group;
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (!currentObj) return;

        const newWorldPosX = canvasToWorldX(node.y());
        const newWorldPosY = canvasToWorldY(node.x());

        // For PUT_NEAR, the referenceId is the object we are putting near to.
        // updateObjectState's pddlContextObjectId should be referenceId for PUT_NEAR
        updateObjectState(objectId, [newWorldPosX, newWorldPosY, currentObj.position[2]], node.rotation(), currentAction, referenceId || undefined);
        setDragStartPos(null);
    };

     const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, objectId: string) => {
        if (currentAction === null || actionState !== 'MANIPULATE') return;
        const node = objectsRef.current.get(objectId);
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (node && currentObj) {
            const newWorldPosX = canvasToWorldX(node.y());
            const newWorldPosY = canvasToWorldY(node.x());
            updateObjectState(objectId, [newWorldPosX, newWorldPosY, currentObj.position[2]], node.rotation(), currentAction, referenceId || undefined);
        }
    };

    const handleFinishAction = () => {
        if (currentStepAction) {
            setTrajectory(prev => [...prev, currentStepAction]);
        }
        setCurrentStepAction(null);
        setSceneObjectsBeforeStep(null);
        setPddlRelationsBeforeStep(null);
        setCurrentAction(null);
        setSelectedId(null);
        setReferenceId(null);
        setActionState('SELECT_TARGET');
    };

    const handleCancelAction = () => {
        if (sceneObjectsBeforeStep && sceneData) {
            setSceneData(prevData => prevData ? { ...prevData, objects: sceneObjectsBeforeStep } : null);
            if (pddlRelationsBeforeStep) {
                setPddlRelations(pddlRelationsBeforeStep);
            }
        }
        setCurrentStepAction(null);
        setSceneObjectsBeforeStep(null);
        setPddlRelationsBeforeStep(null);
        setCurrentAction(null);
        setSelectedId(null);
        setReferenceId(null);
        setActionState('SELECT_TARGET');
    };

    const ActionButton: React.FC<{ action: ActionType; label: string }> = ({ action, label }) => (
        <button
            className={`action-button ${currentAction === action ? 'active' : 'inactive'}`}
            onClick={() => {
                setCurrentAction(action);
                setSelectedId(null); // Reset selections when a new action type is chosen
                setReferenceId(null);
                setActionState('SELECT_TARGET');
                setCurrentStepAction(null); // Clear any pending step
                setSceneObjectsBeforeStep(null);
                setPddlRelationsBeforeStep(null);
            }}
        >
            {label}
        </button>
    );

    // manipulatedObjId: The object whose physical state (pos/rot) changed.
    // actionType: The semantic action performed (e.g., 'OPEN', 'PUT_ON').
    // pddlContextObjId: The object that is the context of the PDDL relation
    // (e.g., for 'OPEN' bowl, manipulatedObjId is lid, pddlContextObjId is bowl).
    const updatePddlRelations = (manipulatedObjId: string, actionType: ActionType, pddlContextObjId?: string) => {
        setPddlRelations((prevPddl: PddlRelationsType) => {
            const newPddl = JSON.parse(JSON.stringify(prevPddl));
            const manipulatedObject = sceneData?.objects.find(o => o.id === manipulatedObjId);
            const contextObject = sceneData?.objects.find(o => o.id === pddlContextObjId);

            // Generic cleanup: Remove manipulatedObjId from 'on' and 'in' before re-adding, if it's being moved.
            newPddl.on = newPddl.on.filter((r: PddlTwoObjectRelation) => r.obj1 !== manipulatedObjId);
            newPddl.in = newPddl.in.filter((r: PddlTwoObjectRelation) => r.obj1 !== manipulatedObjId);

            // If the manipulated object was a lid, and it's not a CLOSE action on its bowl,
            // its original bowl should no longer be considered closed by this lid.
            if (manipulatedObject?.category === 'lid') {
                const itsMappedBowlId = Object.keys(bowlToLidMap).find(bowlId => bowlToLidMap[bowlId] === manipulatedObjId);
                if (itsMappedBowlId) {
                    // If the action is not closing this specific bowl with this lid, mark the bowl as not closed.
                    if (!(actionType === 'CLOSE' && pddlContextObjId === itsMappedBowlId)) {
                        newPddl.closed = newPddl.closed.filter((r: PddlSingleObjectRelation) => r.obj1 !== itsMappedBowlId);
                    }
                }
            }

            if (actionType === 'PUT_ON' && contextObject) {
                newPddl.on.push({ obj1: manipulatedObjId, obj2: contextObject.id });
            } else if (actionType === 'PUT_IN' && contextObject) {
                newPddl.in.push({ obj1: manipulatedObjId, obj2: contextObject.id });
            } else if (actionType === 'OPEN' && contextObject?.name?.includes('bowl')) {
                // pddlContextObjId (contextObject.id) is the bowl. manipulatedObjId is the lid.
                // Bowl is no longer closed.
                newPddl.closed = newPddl.closed.filter((r: PddlSingleObjectRelation) => r.obj1 !== contextObject.id);
                // Lid is no longer 'on' this bowl (it has been moved).
                newPddl.on = newPddl.on.filter((r: PddlTwoObjectRelation) => !(r.obj1 === manipulatedObjId && r.obj2 === contextObject.id));
            } else if (actionType === 'CLOSE' && contextObject?.name?.includes('bowl')) {
                // pddlContextObjId (contextObject.id) is the bowl. manipulatedObjId is the lid.
                // Bowl becomes closed if it's the correct lid.
                if (bowlToLidMap[contextObject.id] === manipulatedObjId) {
                    // Always add when CLOSE action is performed, set will handle duplicates
                    newPddl.closed.push({ obj1: contextObject.id });
                    // The 'on(lid, bowl)' relation is represented by 'closed', so remove from 'on'.
                    newPddl.on = newPddl.on.filter((r: PddlTwoObjectRelation) => !(r.obj1 === manipulatedObjId && r.obj2 === contextObject.id));
                }
            }
             // Ensure uniqueness in closed list
             newPddl.closed = Array.from(new Set(newPddl.closed.map((item: {obj1: string}) => JSON.stringify(item)))).map(item => JSON.parse(item as string));

            return newPddl;
        });
    };


    const renderAxesAndGrid = () => {
        const ticks: { x: number[], y: number[] } = { x: [], y: [] };
        const stageW = stageSize.width;
        const stageH = stageSize.height;

        for (let y = Math.ceil(WORLD_Y_MIN / TICK_INTERVAL) * TICK_INTERVAL; y <= WORLD_Y_MAX; y += TICK_INTERVAL) {
            ticks.y.push(parseFloat(y.toFixed(1)));
        }
        for (let x = Math.ceil(WORLD_X_MIN / TICK_INTERVAL) * TICK_INTERVAL; x <= WORLD_X_MAX; x += TICK_INTERVAL) {
            ticks.x.push(parseFloat(x.toFixed(1)));
        }

        const xAxisY = worldToCanvasY(WORLD_X_MIN);
        const yAxisX = worldToCanvasX(WORLD_Y_MIN);
        const elements = [];

        ticks.y.forEach((y, i) => {
            const x = worldToCanvasX(y);
            elements.push(<Line key={`v_grid_${i}`} points={[x, canvasOffsetY, x, stageH - canvasOffsetY]} stroke={GRID_COLOR} strokeWidth={0.5} dash={[2, 2]} listening={false}/>);
        });
        ticks.x.forEach((x, i) => {
            const y = worldToCanvasY(x);
            elements.push(<Line key={`h_grid_${i}`} points={[canvasOffsetX, y, stageW - canvasOffsetX, y]} stroke={GRID_COLOR} strokeWidth={0.5} dash={[2, 2]} listening={false}/>);
        });

        elements.push(<Line key="x_axis" points={[canvasOffsetX, xAxisY, stageW - canvasOffsetX, xAxisY]} stroke={AXIS_COLOR} strokeWidth={AXIS_WIDTH} listening={false}/>);
        elements.push(<Line key="y_axis" points={[yAxisX, canvasOffsetY, yAxisX, stageH - canvasOffsetY]} stroke={AXIS_COLOR} strokeWidth={AXIS_WIDTH} listening={false}/>);

        ticks.y.forEach((y, i) => {
            const x = worldToCanvasX(y);
            elements.push(<Line key={`x_tick_${i}`} points={[x, xAxisY - 4, x, xAxisY + 4]} stroke={AXIS_COLOR} strokeWidth={TICK_WIDTH} listening={false}/>);
            elements.push(<Text key={`x_label_${i}`} x={x} y={xAxisY + 7} text={y.toFixed(1)} fontSize={LABEL_FONT_SIZE} fill={LABEL_COLOR} offsetX={LABEL_FONT_SIZE * y.toFixed(1).length / 4} listening={false}/>);
        });

        ticks.x.forEach((x, i) => {
            const y = worldToCanvasY(x);
            elements.push(<Line key={`y_tick_${i}`} points={[yAxisX - 4, y, yAxisX + 4, y]} stroke={AXIS_COLOR} strokeWidth={TICK_WIDTH} listening={false}/>);
            elements.push(<Text key={`y_label_${i}`} x={yAxisX - 30} y={y} text={x.toFixed(1)} fontSize={LABEL_FONT_SIZE} fill={LABEL_COLOR} offsetY={LABEL_FONT_SIZE / 2} width={25} align="right" listening={false}/>);
        });

        elements.push(<Text key="x_title" x={stageW / 2} y={AXIS_PADDING * 10} text="World Y" fontSize={LABEL_FONT_SIZE + 1} fill="black" offsetX={LABEL_FONT_SIZE + 1} offsetY={3 * LABEL_FONT_SIZE} listening={false} />);
        elements.push(<Text key="y_title" x={AXIS_PADDING} y={stageH / 2} text="World X" fontSize={LABEL_FONT_SIZE + 1} fill="black" rotation={-90} offsetX={LABEL_FONT_SIZE} offsetY={-LABEL_FONT_SIZE} listening={false}/>);

        return elements;
    };


  return (
    <div className="app-container">
        <div className="column left-column">
          <div className="section">
                  <h2>Task</h2>
                   <div className="input-group">
                       <input
                           type="text"
                           placeholder="Enter Scene ID"
                           value={sceneId}
                           onChange={(e) => setSceneId(e.target.value)}
                           list="scene-ids"
                       />
                       <datalist id="scene-ids">
                           {sceneList.map(id => <option key={id} value={id} />)}
                       </datalist>
                   </div>
                   <div className="controls-buttons" style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                       <button onClick={handlePrev} disabled={sceneList.indexOf(sceneId) <= 0}>
                           &lt; Prev
                       </button>
                       <button onClick={handleLoadSceneClick}>Load</button>
                       <button onClick={handleNext} disabled={sceneList.indexOf(sceneId) < 0 || sceneList.indexOf(sceneId) >= sceneList.length - 1}>
                           Next &gt;
                       </button>
                   </div>
                  <div className="controls-buttons" style={{ marginTop: '10px' }}>
                       <button onClick={saveTrajectory} disabled={trajectory.length === 0}>
                           Save Trajectory & PDDL
                       </button>
                  </div>
              </div>
            <div className="section">
                 <h2>Original Scene</h2>
                 <img
                    src={sceneData ? `http://localhost:8000/images/scene_${sceneData.task_id}_rgb.png` : '/images/placeholder.png'}
                    alt="Scene"
                    className="scene-image"
                 />
            </div>
             {pddlRelations && (
                <div className="section">
                    <h2>PDDL Relations</h2>
                    <pre className="pddl-pre">{JSON.stringify(pddlRelations, null, 2)}</pre>
                </div>
            )}
            {sceneData && (
                <div className="section">
                  <h2>Scene Info</h2>
                  <p>Objects ({sceneData.objects.length}):</p>
                  <ul className="scene-info-list">
                      {sceneData.objects.map(o => <li key={o.id}>{o.name} ({o.category} - {o.id})</li>)}
                  </ul>
                </div>
            )}

        </div>

        <div className="column center-column" ref={centerColRef}>
             <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                ref={stageRef}
             >
                <Layer ref={layerRef}>
                   {renderAxesAndGrid()}
                    {sceneData && sceneData.objects.map(obj => {
                        const isSelectedObj = obj.id === selectedId;
                        const isReferenceObj = obj.id === referenceId;
                        const rectCanvasWidth = obj.size[0] * worldToCanvasScale;
                        const rectCanvasHeight = obj.size[1] * worldToCanvasScale;
                        const groupCanvasX = worldToCanvasX(obj.position[1]);
                        const groupCanvasY = worldToCanvasY(obj.position[0]);
                        const isDraggable = (currentAction === 'PUT_NEAR' && actionState === 'MANIPULATE' && isSelectedObj);


                        return (
                            <Group
                                key={obj.id}
                                ref={node => {
                                    if (node) objectsRef.current.set(obj.id, node);
                                    else objectsRef.current.delete(obj.id);
                                }}
                                x={groupCanvasX}
                                y={groupCanvasY}
                                rotation={obj.orientation}
                                draggable={isDraggable}
                                onClick={(e) => handleObjectClick(obj, e)}
                                onDragEnd={(e) => handleDragEnd(e, obj.id)}
                                onTransformEnd={(e) => handleTransformEnd(e, obj.id)}
                                onDragStart={handleDragStart}
                                dragBoundFunc={isDraggable ? constrainedDrag : undefined}
                                offsetX={0}
                                offsetY={0}
                            >
                                <Rect
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    fill={getObjectColor(obj.category)}
                                    stroke={isSelectedObj && currentAction !== null ? '#FF0000' : (isReferenceObj && currentAction !== null ? '#0000FF' : '#333333')}
                                    strokeWidth={isSelectedObj && currentAction !== null ? 2.5 : (isReferenceObj && currentAction !== null ? 2 : 1)}
                                    shadowBlur={isSelectedObj && currentAction !== null ? 8 : 0}
                                    shadowColor={isSelectedObj && currentAction !== null ? '#FF4500' : 'transparent'}
                                    offsetX={rectCanvasWidth / 2}
                                    offsetY={rectCanvasHeight / 2}
                                    opacity={0.65}
                                />
                                <Text
                                    text={obj.name}
                                    fontSize={12}
                                    fill="#000000"
                                    align="center"
                                    verticalAlign="middle"
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    offsetX={rectCanvasWidth / 2}
                                    offsetY={rectCanvasHeight / 2}
                                    listening={false}
                                    padding={1}
                                    wrap="char"
                                />
                            </Group>
                        );
                    })}
                    <Transformer
                        ref={trRef}
                        keepRatio={false}
                        anchorStroke="#FF0000"
                        anchorFill="#FFFFFF"
                        anchorSize={8}
                        borderStroke="#FF0000"
                        borderDash={[4, 4]}
                        rotateAnchorOffset={20}
                        enabledAnchors={[]}
                        rotateEnabled={true}
                    />
                </Layer>
            </Stage>
        </div>

        <div className="column right-column">
        <div className="section">
                <h2>Current State</h2>
                <p>Action: <b>{currentAction || 'None'}</b></p>
                <p>Selected: <b>{selectedId || 'None'}</b></p>
                <p>Action State: <b>{actionState}</b></p>
                {referenceId && <p>Reference: <b>{referenceId}</b></p>}
             </div>

             <div className="section">
                <h2>Actions</h2>
                <div className="button-group">
                    <ActionButton action="OPEN" label="Open" />
                    <ActionButton action="CLOSE" label="Close" />
                    <ActionButton action="PUT_IN" label="Put In" />
                    <ActionButton action="PUT_ON" label="Put On" />
                    <ActionButton action="PUT_NEAR" label="Put Near" />
                </div>
                <div style={{ display: 'flex', marginTop: '15px', gap: '10px' }}>
                    <button
                        onClick={handleFinishAction}
                        disabled={!currentStepAction}
                        style={{
                            backgroundColor: currentStepAction ? '#4CAF50' : '#ccc',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: currentStepAction ? 'pointer' : 'not-allowed',
                            flex: 1
                        }}
                    >
                        Finish Current Action
                    </button>
                    <button
                        onClick={handleCancelAction}
                        disabled={!currentStepAction && !currentAction} // Enable if an action is selected or a step is pending
                        style={{
                            backgroundColor: (currentStepAction || currentAction) ? '#f44336' : '#ccc',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: (currentStepAction || currentAction) ? 'pointer' : 'not-allowed',
                            flex: 1
                        }}
                    >
                        Cancel
                    </button>
                </div>
             </div>

             <div className="section">
                <h2>Trajectory</h2>
                <pre className="trajectory-pre">{JSON.stringify(trajectory, null, 2)}</pre>
             </div>

        </div>
    </div>
  );
};

export default App;