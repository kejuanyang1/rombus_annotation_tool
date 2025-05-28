import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Rect, Transformer, Text, Group } from 'react-konva';
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

type ActionType = 'SELECT' | 'PUT_NEAR' | 'PUT_IN' | 'PUT_ON' | 'OPEN_CLOSE' | null;
type PutNearState = 'SELECT_TARGET' | 'SELECT_REFERENCE' | 'MANIPULATE';

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
    const [currentAction, setCurrentAction] = useState<ActionType>('SELECT');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [referenceId, setReferenceId] = useState<string | null>(null);
    const [putNearState, setPutNearState] = useState<PutNearState>('SELECT_TARGET');
    const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 400 });

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
            setCurrentAction('SELECT');
            setPutNearState('SELECT_TARGET');
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
   const updateObjectState = (objectId: string, newPos: [number, number, number], newOrientation: number) => {
        setSceneData(prevData => {
            if (!prevData) return null;
            const updatedObjects = prevData.objects.map(obj =>
                obj.id === objectId ? { ...obj, position: newPos, orientation: newOrientation } : obj
            );
            return { ...prevData, objects: updatedObjects };
        });
        setTrajectory(prev => [
            ...prev,
            { type: "MOVE_OBJECT_TO", objectId, new_pos: newPos, new_orientation: newOrientation },
        ]);
    };

    // --- Transformer Logic ---
    useEffect(() => {
        if (trRef.current) {
            const selectedNode = selectedId ? objectsRef.current.get(selectedId) : null;
            if (selectedNode && (currentAction === 'SELECT' || (currentAction === 'PUT_NEAR' && putNearState === 'MANIPULATE'))) {
                trRef.current.nodes([selectedNode]);
                trRef.current.enabledAnchors([]);
                trRef.current.rotateEnabled(true);
            } else {
                trRef.current.nodes([]);
            }
            trRef.current.getLayer()?.batchDraw();
        }
    }, [selectedId, currentAction, putNearState]);

    // --- Constrained Drag for 'Put Near' ---
    const constrainedDrag = (pos: { x: number; y: number }) => {
        if (!dragStartPos || currentAction !== 'PUT_NEAR' || putNearState !== 'MANIPULATE') return pos;
        const dx = Math.abs(pos.x - dragStartPos.x);
        const dy = Math.abs(pos.y - dragStartPos.y);
        return dx > dy ? { x: pos.x, y: dragStartPos.y } : { x: dragStartPos.x, y: pos.y };
    };

    // --- Event Handlers ---
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === e.target.getStage()) {
            setSelectedId(null);
            setReferenceId(null);
            if (currentAction === 'PUT_NEAR') setPutNearState('SELECT_TARGET');
        }
    };

    const handleObjectClick = (objData: ObjectData, e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.stopPropagation();
        const id = objData.id;

        switch (currentAction) {
            case 'SELECT':
                setSelectedId(id);
                break;
            case 'PUT_IN':
            case 'PUT_ON':
                if (!selectedId) {
                    setSelectedId(id);
                } else if (id !== selectedId) {
                    const targetContainer = sceneData?.objects.find(o => o.id === id);
                    const movingObj = sceneData?.objects.find(o => o.id === selectedId);

                    if (targetContainer && movingObj && ['basket', 'support', 'bowl', 'container'].includes(targetContainer.category)) {
                        // Target container's center is its position
                        const targetWorldCenterX = targetContainer.position[0];
                        const targetWorldCenterY = targetContainer.position[1];
                        
                        // Moving object's new position (center) will be the target's center
                        const newMovingObjWorldX = targetWorldCenterX;
                        const newMovingObjWorldY = targetWorldCenterY;
                        
                        const newZ = targetContainer.position[2] + targetContainer.size[2]; // Stack on top
                        updateObjectState(selectedId, [newMovingObjWorldX, newMovingObjWorldY, newZ], 0);
                        setSelectedId(null);
                    }
                }
                break;
            case 'PUT_NEAR':
                if (putNearState === 'SELECT_TARGET') {
                    setSelectedId(id);
                    setPutNearState('SELECT_REFERENCE');
                } else if (putNearState === 'SELECT_REFERENCE' && id !== selectedId) {
                    setReferenceId(id);
                    setPutNearState('MANIPULATE');
                }
                break;
        }
    };

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (currentAction === 'PUT_NEAR' && putNearState === 'MANIPULATE') {
            setDragStartPos({ x: e.target.x(), y: e.target.y() });
        } else {
            setDragStartPos(null);
        }
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, objectId: string) => {
        const node = e.target as Konva.Group;
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (!currentObj) return;

        // node.x() and node.y() are canvas center coordinates
        const newWorldPosY = (node.x() / worldToCanvasScale) + WORLD_Y_MIN; // world horizontal center (obj.position[1])
        const newWorldPosX = ((node.y() - canvasOffsetY) / worldToCanvasScale) + WORLD_X_MIN; // world vertical center (obj.position[0])

        updateObjectState(objectId, [newWorldPosX, newWorldPosY, currentObj.position[2]], node.rotation());
        setDragStartPos(null);
    };

    const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, objectId: string) => {
        const node = objectsRef.current.get(objectId);
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (node && currentObj) {
            const newWorldPosY = (node.x() / worldToCanvasScale) + WORLD_Y_MIN;
            const newWorldPosX = ((node.y() - canvasOffsetY) / worldToCanvasScale) + WORLD_X_MIN;

            updateObjectState(objectId, [newWorldPosX, newWorldPosY, currentObj.position[2]], node.rotation());
        }
    };

    // --- UI Elements ---
    const ActionButton: React.FC<{ action: ActionType; label: string }> = ({ action, label }) => (
        <button
            className={`action-button ${currentAction === action ? 'active' : 'inactive'}`}
            onClick={() => {
                setCurrentAction(action);
                setSelectedId(null);
                setReferenceId(null);
                setPutNearState('SELECT_TARGET');
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
                    {sceneData && sceneData.objects.map(obj => {
                        const isSelected = obj.id === selectedId;
                        const isDraggable = currentAction === 'SELECT' ||
                                           (currentAction === 'PUT_NEAR' && putNearState === 'MANIPULATE' && obj.id === selectedId);

                        // obj.size[1] is world_width_horizontal, obj.size[0] is world_depth_vertical
                        const rectCanvasWidth = obj.size[0] * worldToCanvasScale;
                        const rectCanvasHeight = obj.size[1] * worldToCanvasScale;

                        // obj.position[1] is world_y_horizontal_CENTER, obj.position[0] is world_x_vertical_CENTER
                        const groupCanvasX = (obj.position[1] - WORLD_Y_MIN) * worldToCanvasScale;
                        const groupCanvasY = ((obj.position[0] - WORLD_X_MIN) * worldToCanvasScale) + canvasOffsetY;

                        return (
                            <Group
                                key={obj.id}
                                ref={node => {
                                    if (node) objectsRef.current.set(obj.id, node);
                                    else objectsRef.current.delete(obj.id);
                                }}
                                x={groupCanvasX} // Canvas X for group (center of the object)
                                y={groupCanvasY} // Canvas Y for group (center of the object)
                                rotation={obj.orientation} // Konva rotates clockwise for positive values
                                draggable={isDraggable}
                                onClick={(e) => handleObjectClick(obj, e)}
                                onTap={(e) => handleObjectClick(obj, e)}
                                onDragEnd={(e) => handleDragEnd(e, obj.id)}
                                onTransformEnd={(e) => handleTransformEnd(e, obj.id)}
                                onDragStart={handleDragStart}
                                dragBoundFunc={isDraggable && currentAction === 'PUT_NEAR' ? constrainedDrag : undefined}
                                // Offset the group so rotation happens around its center (which is where x,y is set)
                                offsetX={0} // Group's origin is its center, rect is drawn relative to this
                                offsetY={0}
                            >
                                <Rect // Rect is drawn centered within the Group
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    fill={getObjectColor(obj.category)}
                                    stroke={isSelected ? 'red' : (obj.id === referenceId ? 'blue' : 'black')}
                                    strokeWidth={isSelected ? 3 : (obj.id === referenceId ? 2 : 0.5)}
                                    shadowBlur={isSelected ? 10 : 0}
                                    shadowColor={isSelected ? 'red' : 'transparent'}
                                    offsetX={rectCanvasWidth / 2} // Center the rect shape itself
                                    offsetY={rectCanvasHeight / 2}
                                    opacity={0.5} // Set opacity to 50%
                                />
                                <Text
                                    text={obj.name}
                                    fontSize={10}
                                    fill="black"
                                    align="center"
                                    verticalAlign="middle"
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    offsetX={rectCanvasWidth / 2} // Center the text shape
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
                <h2>Actions</h2>
                <div className="button-group">
                    <ActionButton action="SELECT" label="Select / Rotate" />
                    <ActionButton action="PUT_IN" label="Put In Basket/Bowl" />
                    <ActionButton action="PUT_ON" label="Put On Support" />
                    <ActionButton action="PUT_NEAR" label="Put Near" />
                </div>
             </div>

             <div className="section">
                <h2>Current State</h2>
                <p>Action: <b>{currentAction || 'None'}</b></p>
                <p>Selected: <b>{selectedId || 'None'}</b></p>
                {currentAction === 'PUT_NEAR' && <p>Put Near State: <b>{putNearState}</b></p>}
                {currentAction === 'PUT_NEAR' && referenceId && <p>Reference: <b>{referenceId}</b></p>}
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

             <div className="section">
                <h2>Trajectory</h2>
                <pre className="trajectory-pre">{JSON.stringify(trajectory, null, 2)}</pre>
             </div>
        </div>
    </div>
  );
};

export default App;
