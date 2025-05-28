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
  isOpen?: boolean;
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
  new_pos?: [number, number, number];
  new_orientation?: number;
}

// --- World Coordinate Display Range ---
const WORLD_X_MIN = 0;    // Vertical world axis (obj.position[0]) - min value
const WORLD_X_MAX = 0.5;  // Vertical world axis (obj.position[0]) - max value
const WORLD_Y_MIN = -0.7; // Horizontal world axis (obj.position[1]) - min value
const WORLD_Y_MAX = 0.3;  // Horizontal world axis (obj.position[1]) - max value

const worldDisplayRangeX = WORLD_X_MAX - WORLD_X_MIN; // Total height of the world viewport (0.5)
const worldDisplayRangeY = WORLD_Y_MAX - WORLD_Y_MIN; // Total width of the world viewport (1.0)

const App: React.FC = () => {
    // --- State Variables ---
    const [sceneId, setSceneId] = useState<string>('01_0');
    const [sceneData, setSceneData] = useState<SceneData | null>(null);
    const [pddlRelations, setPddlRelations] = useState<any>(null);
    const [trajectory, setTrajectory] = useState<any[]>([]);
    const [currentAction, setCurrentAction] = useState<ActionType>(null); // Initialized to null
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [referenceId, setReferenceId] = useState<string | null>(null);
    const [actionState, setActionState] = useState<ActionState>('SELECT_TARGET');
    const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 400 });
    const [currentStepAction, setCurrentStepAction] = useState<Action | null>(null);
    const [sceneObjectsBeforeStep, setSceneObjectsBeforeStep] = useState<ObjectData[] | null>(null);


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

    // --- Calculate Uniform Scale and Vertical Offset ---
    const worldToCanvasScale = useMemo(() => {
        if (stageSize.width > 0 && worldDisplayRangeY > 0) {
            return stageSize.width / worldDisplayRangeY;
        }
        return 100;
    }, [stageSize.width, worldDisplayRangeY]);

    const canvasOffsetY = useMemo(() => {
        if (stageSize.height > 0 && worldDisplayRangeX > 0 && worldToCanvasScale > 0) {
            const contentActualCanvasHeight = worldDisplayRangeX * worldToCanvasScale;
            return (stageSize.height - contentActualCanvasHeight) / 2;
        }
        return 0;
    }, [stageSize.height, worldDisplayRangeX, worldToCanvasScale]);

    // --- Data Loading ---
    const loadScene = async () => {
        if (!sceneId) {
            alert("Please enter a Scene ID.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/scene/${sceneId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
                throw new Error(`HTTP error! status: ${response.status}, ${errorData.detail}`);
            }
            const data = await response.json();
            setSceneData(data.scene);
            setPddlRelations(data.pddl);
            setTrajectory([]);
            setSelectedId(null);
            setReferenceId(null);
            setCurrentAction(null);
            setActionState('SELECT_TARGET');
            setCurrentStepAction(null);
            setSceneObjectsBeforeStep(null);
        } catch (error) {
            console.error("Error loading scene:", error);
            alert(`Error loading scene: ${error instanceof Error ? error.message : String(error)}`);
            setSceneData(null);
            setPddlRelations(null);
        }
    };

    // --- Save Trajectory ---
    const saveTrajectory = async () => {
        if (!sceneData) return;
        try {
            await fetch(`http://localhost:8000/save_trajectory/${sceneData.task_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trajectory),
            });
            alert('Trajectory saved!');
        } catch (error) {
            console.error('Error saving trajectory:', error);
            alert('Error saving trajectory.');
        }
    };

    // --- Color Mapping ---
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

   // --- Update Scene and Trajectory ---
   const updateObjectState = (objectId: string, newPos: [number, number, number] | null, newOrientation: number | null, actionType: ActionType, isOpen?: boolean) => {
        if (!currentStepAction && sceneData) {
            setSceneObjectsBeforeStep(sceneData.objects.map(o => ({ ...o }))); // Store copy of objects
        } else if (!sceneData) {
            setSceneObjectsBeforeStep(null);
        }

        setSceneData(prevData => {
            if (!prevData) return null;
            const updatedObjects = prevData.objects.map(obj => {
                if (obj.id === objectId) {
                    const updatedObj = { ...obj };
                    if (newPos) updatedObj.position = newPos;
                    if (newOrientation !== null) updatedObj.orientation = newOrientation;
                    if (isOpen !== undefined) updatedObj.isOpen = isOpen;
                    return updatedObj;
                }
                return obj;
            });
            return { ...prevData, objects: updatedObjects };
        });

        if (isOpen !== undefined) {
            setCurrentStepAction({ type: actionType, objectId });
        } else if (newPos && newOrientation !== null) {
            setCurrentStepAction({ type: actionType, objectId, new_pos: newPos, new_orientation: newOrientation });
        }
    };

    // --- Transformer Logic ---
    useEffect(() => {
        if (trRef.current) {
            const selectedNode = selectedId ? objectsRef.current.get(selectedId) : null;
            // Enable transformer if an object is selected and an action is active (not null)
            // or if in MANIPULATE state (which implies an action is active)
            if (selectedNode && (currentAction !== null || actionState === 'MANIPULATE')) {
                trRef.current.nodes([selectedNode]);
                trRef.current.enabledAnchors([]); // Only rotation for now
                trRef.current.rotateEnabled(true);
            } else {
                trRef.current.nodes([]);
            }
            trRef.current.getLayer()?.batchDraw();
        }
    }, [selectedId, currentAction, actionState]);


    // --- Constrained Drag for 'Put Near' ---
    const constrainedDrag = (pos: { x: number; y: number }) => {
        if (!dragStartPos || currentAction !== 'PUT_NEAR' || actionState !== 'MANIPULATE') return pos;
        const dx = Math.abs(pos.x - dragStartPos.x);
        const dy = Math.abs(pos.y - dragStartPos.y);
        return dx > dy ? { x: pos.x, y: dragStartPos.y } : { x: dragStartPos.x, y: pos.y };
    };

    // --- Event Handlers ---
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === e.target.getStage()) {
            setSelectedId(null);
            setReferenceId(null);
            setActionState('SELECT_TARGET');
            setCurrentAction(null);
            // Do not clear currentStepAction or sceneObjectsBeforeStep here,
            // as the user might want to finish/cancel an ongoing step.
        }
    };

    const handleObjectClick = (objData: ObjectData, e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.stopPropagation();
        const id = objData.id;

        if (currentAction === null) {
            return; // Interaction disabled if no action is active
        }

        if (actionState === 'SELECT_TARGET') {
            setSelectedId(id);
            setActionState('SELECT_REFERENCE');

            if (currentAction === 'OPEN' || currentAction === 'CLOSE') {
                const targetObj = sceneData?.objects.find(o => o.id === id);
                if (targetObj) {
                    updateObjectState(id, null, 0, currentAction, currentAction === 'OPEN');
                }
            }
        } else if (actionState === 'SELECT_REFERENCE' && id !== selectedId) {
            setReferenceId(id);

            const refObj = sceneData?.objects.find(o => o.id === id);
            const targetObj = sceneData?.objects.find(o => o.id === selectedId);

            if (targetObj && refObj) {
                const targetWorldCenterX = refObj.position[0];
                const targetWorldCenterY = refObj.position[1];
                const newTargetObjWorldX = targetWorldCenterX;
                const newTargetObjWorldY = targetWorldCenterY;    

                if (currentAction === 'PUT_IN') {
                    if (['container'].includes(refObj.category)) {
                        updateObjectState(selectedId!, [newTargetObjWorldX, newTargetObjWorldY, targetObj.size[2] / 2], 0, currentAction);
                    }
                } else if (currentAction === 'PUT_ON') {
                    let newZ = refObj.position[2] + targetObj.size[2] / 2;
                    updateObjectState(selectedId!, [newTargetObjWorldX, newTargetObjWorldY, newZ], 0, currentAction);
                } else if (currentAction === 'PUT_NEAR') {
                    setActionState('MANIPULATE');
                    return;
                }
            }
        }
    };

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (actionState === 'MANIPULATE' && currentAction !== null) { // Ensure an action is active
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
        } else {
            setDragStartPos(null);
        }
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
        if (currentAction === null) return; // No action, no state update

        const node = e.target as Konva.Group;
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (!currentObj) return;

        const newWorldPosY = (node.x() / worldToCanvasScale) + WORLD_Y_MIN;
        const newWorldPosX = ((node.y() - canvasOffsetY) / worldToCanvasScale) + WORLD_X_MIN;

        updateObjectState(objectId, [newWorldPosX, newWorldPosY, currentObj.position[2]], node.rotation(), currentAction);
        setDragStartPos(null);
    };

    const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, objectId: string) => {
        if (currentAction === null) return; // No action, no state update

        const node = objectsRef.current.get(objectId);
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (node && currentObj) {
            const newWorldPosY = (node.x() / worldToCanvasScale) + WORLD_Y_MIN;
            const newWorldPosX = ((node.y() - canvasOffsetY) / worldToCanvasScale) + WORLD_X_MIN;

            updateObjectState(objectId, [newWorldPosX, newWorldPosY, currentObj.position[2]], node.rotation(), currentAction);
        }
    };

    const handleFinishAction = () => {
        if (currentStepAction) {
            setTrajectory(prev => [...prev, currentStepAction]);
            setCurrentStepAction(null);
            setSceneObjectsBeforeStep(null);
            setCurrentAction(null);
            setSelectedId(null);
            setReferenceId(null);
            setActionState('SELECT_TARGET');
        }
    };

    const handleCancelAction = () => {
        if (sceneObjectsBeforeStep && sceneData) {
            setSceneData(prevData => {
                if (!prevData) return null;
                return {
                    ...prevData,
                    objects: sceneObjectsBeforeStep.map(o => ({ ...o })) // Revert to stored state
                };
            });
        }
        setCurrentStepAction(null);
        setSceneObjectsBeforeStep(null);
        setCurrentAction(null);
        setSelectedId(null);
        setReferenceId(null);
        setActionState('SELECT_TARGET');
    };


    // --- UI Elements ---
    const ActionButton: React.FC<{ action: ActionType; label: string }> = ({ action, label }) => (
        <button
            className={`action-button ${currentAction === action ? 'active' : 'inactive'}`}
            onClick={() => {
                setCurrentAction(action);
                setSelectedId(null); // Reset selection when a new action is chosen
                setReferenceId(null);
                setActionState('SELECT_TARGET');
                setCurrentStepAction(null); // Clear any pending step from a previous action
                setSceneObjectsBeforeStep(null);
            }}
        >
            {label}
        </button>
    );

  return (
    <div className="app-container">
        {/* --- Left Column --- */}
        <div className="column left-column">
          <div className="section">
                  <h2>Controls</h2>
                  <div className="input-group">
                      <input
                          type="text"
                          placeholder="Enter Scene ID (e.g., 01_0)"
                          value={sceneId}
                          onChange={(e) => setSceneId(e.target.value)}
                      />
                  </div>
                  <div className="controls-buttons">
                      <button onClick={loadScene}>Load Scene</button>
                      <button onClick={saveTrajectory} disabled={trajectory.length === 0}>
                          Save Trajectory
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
        </div>

        {/* --- Center Column --- */}
        <div className="column center-column" ref={centerColRef}>
             <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                ref={stageRef}
             >
                <Layer ref={layerRef}>
                    {/* Grid and Axes */}
                    {[...Array(Math.floor(worldDisplayRangeY * 10) + 1)].map((_, i) => (
                        <Line
                            key={`v_line_${i}`}
                            points={[
                                (i / 10 + WORLD_Y_MIN - WORLD_Y_MIN) * worldToCanvasScale,
                                0,
                                (i / 10 + WORLD_Y_MIN - WORLD_Y_MIN) * worldToCanvasScale,
                                stageSize.height,
                            ]}
                            stroke="#ccc"
                            strokeWidth={0.5}
                        />
                    ))}
                    {[...Array(Math.floor(worldDisplayRangeX * 10) + 1)].map((_, i) => (
                        <Line
                            key={`h_line_${i}`}
                            points={[
                                0,
                                (i / 10) * worldToCanvasScale + canvasOffsetY,
                                stageSize.width,
                                (i / 10) * worldToCanvasScale + canvasOffsetY,
                            ]}
                            stroke="#ccc"
                            strokeWidth={0.5}
                        />
                    ))}
                    <Line
                        points={[(-WORLD_Y_MIN) * worldToCanvasScale, 0, (-WORLD_Y_MIN) * worldToCanvasScale, stageSize.height]}
                        stroke="black"
                        strokeWidth={1}
                    />
                    <Line
                        points={[0, canvasOffsetY, stageSize.width, canvasOffsetY]}
                        stroke="black"
                        strokeWidth={1}
                    />

                    {sceneData && sceneData.objects.map(obj => {
                        const isSelected = obj.id === selectedId;
                        const isDraggable = (currentAction === 'PUT_NEAR' && actionState === 'MANIPULATE' && obj.id === selectedId);

                        const rectCanvasWidth = obj.size[0] * worldToCanvasScale;
                        const rectCanvasHeight = obj.size[1] * worldToCanvasScale;

                        const groupCanvasX = (obj.position[1] - WORLD_Y_MIN) * worldToCanvasScale;
                        const groupCanvasY = ((obj.position[0] - WORLD_X_MIN) * worldToCanvasScale) + canvasOffsetY;

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
                                draggable={isDraggable && currentAction !== null}
                                onClick={(e) => handleObjectClick(obj, e)}
                                onTap={(e) => handleObjectClick(obj, e)}
                                onDragEnd={(e) => handleDragEnd(e, obj.id)}
                                onTransformEnd={(e) => handleTransformEnd(e, obj.id)}
                                onDragStart={handleDragStart}
                                dragBoundFunc={isDraggable && currentAction === 'PUT_NEAR' ? constrainedDrag : undefined}
                                offsetX={0}
                                offsetY={0}
                            >
                                <Rect
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    fill={getObjectColor(obj.category)}
                                    stroke={isSelected && currentAction !== null ? 'red' : (obj.id === referenceId && currentAction !== null ? 'blue' : 'black')}
                                    strokeWidth={isSelected && currentAction !== null ? 3 : (obj.id === referenceId && currentAction !== null ? 2 : 0.5)}
                                    shadowBlur={isSelected && currentAction !== null ? 10 : 0}
                                    shadowColor={isSelected && currentAction !== null ? 'red' : 'transparent'}
                                    offsetX={rectCanvasWidth / 2}
                                    offsetY={rectCanvasHeight / 2}
                                    opacity={0.5}
                                />
                                <Text
                                    text={obj.name}
                                    fontSize={10}
                                    fill="black"
                                    align="center"
                                    verticalAlign="middle"
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    offsetX={rectCanvasWidth / 2}
                                    offsetY={rectCanvasHeight / 2}
                                    listening={false}
                                    padding={2}
                                />
                            </Group>
                        );
                    })}
                    <Transformer
                        ref={trRef}
                        keepRatio={true}
                        anchorStroke="red"
                        anchorFill="white"
                        anchorSize={10}
                        borderStroke="red"
                        borderDash={[3, 3]}
                        rotateAnchorOffset={25}
                        enabledAnchors={[]}
                        rotateEnabled={true}
                    />
                </Layer>
            </Stage>
        </div>

        {/* --- Right Column --- */}
        <div className="column right-column">
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
                        disabled={!currentStepAction}
                        style={{
                            backgroundColor: currentStepAction ? '#f44336' : '#ccc', // Red when active, gray when inactive
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: currentStepAction ? 'pointer' : 'not-allowed',
                            flex: 1
                        }}
                    >
                        Cancel
                    </button>
                </div>
             </div>

             <div className="section">
                <h2>Current State</h2>
                <p>Action: <b>{currentAction || 'None'}</b></p>
                <p>Selected: <b>{selectedId || 'None'}</b></p>
                <p>Action State: <b>{actionState}</b></p>
                {referenceId && <p>Reference: <b>{referenceId}</b></p>}
             </div>

             <div className="section">
                <h2>Trajectory</h2>
                <pre className="trajectory-pre">{JSON.stringify(trajectory, null, 2)}</pre>
             </div>

             {sceneData && (
                 <div className="section">
                    <h2>Scene Info</h2>
                    <p>Task ID: {sceneData.task_id}</p>
                    <p>Objects ({sceneData.objects.length}):</p>
                    <ul className="scene-info-list">
                        {sceneData.objects.map(o => <li key={o.id}>{o.name} ({o.category} - {o.id})</li>)}
                    </ul>
                 </div>
              )}
        </div>
    </div>
  );
};

export default App;