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
    const [sceneList, setSceneList] = useState<string[]>([]); // New state for scene list
    const [sceneData, setSceneData] = useState<SceneData | null>(null);
    const [pddlRelations, setPddlRelations] = useState<any>(null);
    const [trajectory, setTrajectory] = useState<any[]>([]);
    const [currentAction, setCurrentAction] = useState<ActionType>(null);
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

    // --- Calculate Uniform Scale and Offsets ---
    const { worldToCanvasScale, canvasOffsetX, canvasOffsetY } = useMemo(() => {
        if (!stageSize.width || !stageSize.height) return { worldToCanvasScale: 100, canvasOffsetX: AXIS_PADDING, canvasOffsetY: AXIS_PADDING };

        const availableWidth = stageSize.width - 2 * AXIS_PADDING;
        const availableHeight = stageSize.height - 2 * AXIS_PADDING;

        const scaleX = availableHeight / worldDisplayRangeX;
        const scaleY = availableWidth / worldDisplayRangeY;

        const scale = Math.min(scaleX, scaleY); // Use min to fit both dimensions

        const contentW = worldDisplayRangeY * scale;
        const contentH = worldDisplayRangeX * scale;

        const offX = (availableWidth - contentW) / 2 + AXIS_PADDING;
        const offY = (availableHeight - contentH) / 2 + AXIS_PADDING;

        return { worldToCanvasScale: scale, canvasOffsetX: offX, canvasOffsetY: offY };

    }, [stageSize.width, stageSize.height, worldDisplayRangeX, worldDisplayRangeY]);


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
                   setSceneId(data.scene_ids[0]); // Set initial if not already set or invalid
                }
            } catch (error) {
                console.error("Error loading scene list:", error);
                alert("Error loading scene list.");
            }
        };
        fetchSceneList();
    }, []); // Run only once on mount

    useEffect(() => {
        if (sceneId) {
            loadScene(sceneId);
        }
    }, [sceneId]); // Reload when sceneId changes

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
            alert(`Error loading scene ${idToLoad}: ${error instanceof Error ? error.message : String(error)}`);
            setSceneData(null);
            setPddlRelations(null);
        }
    };

     // --- Navigation Handlers ---
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
            setSceneObjectsBeforeStep(sceneData.objects.map(o => ({ ...o })));
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


    // --- Constrained Drag ---
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
        }
    };

    const handleObjectClick = (objData: ObjectData, e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.stopPropagation();
        const id = objData.id;
        if (currentAction === null) return;

        if (actionState === 'SELECT_TARGET') {
            setSelectedId(id);
            setActionState('SELECT_REFERENCE');
            if (currentAction === 'OPEN' || currentAction === 'CLOSE') {
                updateObjectState(id, null, 0, currentAction, currentAction === 'OPEN');
            }
        } else if (actionState === 'SELECT_REFERENCE' && id !== selectedId) {
            setReferenceId(id);
            const refObj = sceneData?.objects.find(o => o.id === id);
            const targetObj = sceneData?.objects.find(o => o.id === selectedId);

            if (targetObj && refObj) {
                const [refX, refY, refZ] = refObj.position;
                const [, , targetZ] = targetObj.size;

                if (currentAction === 'PUT_IN' && ['container'].includes(refObj.category)) {
                    updateObjectState(selectedId!, [refX, refY, targetZ / 2], 0, currentAction);
                } else if (currentAction === 'PUT_ON') {
                    updateObjectState(selectedId!, [refX, refY, refZ + targetZ / 2], 0, currentAction);
                } else if (currentAction === 'PUT_NEAR') {
                    setActionState('MANIPULATE');
                    return; // Don't reset yet
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
        if (currentAction === null) return;
        const node = e.target as Konva.Group;
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (!currentObj) return;

        const newWorldPosX = canvasToWorldX(node.y());
        const newWorldPosY = canvasToWorldY(node.x());

        updateObjectState(objectId, [newWorldPosX, newWorldPosY, currentObj.position[2]], node.rotation(), currentAction);
        setDragStartPos(null);
    };

     const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, objectId: string) => {
        if (currentAction === null) return;
        const node = objectsRef.current.get(objectId);
        const currentObj = sceneData?.objects.find(o => o.id === objectId);
        if (node && currentObj) {
            const newWorldPosX = canvasToWorldX(node.y());
            const newWorldPosY = canvasToWorldY(node.x());
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
            setSceneData(prevData => prevData ? { ...prevData, objects: sceneObjectsBeforeStep } : null);
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
                setSelectedId(null);
                setReferenceId(null);
                setActionState('SELECT_TARGET');
                setCurrentStepAction(null);
                setSceneObjectsBeforeStep(null);
            }}
        >
            {label}
        </button>
    );

    // --- Render Axes and Grid ---
    const renderAxesAndGrid = () => {
        const ticks: { x: number[], y: number[] } = { x: [], y: [] };
        const stageW = stageSize.width;
        const stageH = stageSize.height;

        // Calculate ticks
        for (let y = Math.ceil(WORLD_Y_MIN / TICK_INTERVAL) * TICK_INTERVAL; y <= WORLD_Y_MAX; y += TICK_INTERVAL) {
            ticks.y.push(parseFloat(y.toFixed(1)));
        }
        for (let x = Math.ceil(WORLD_X_MIN / TICK_INTERVAL) * TICK_INTERVAL; x <= WORLD_X_MAX; x += TICK_INTERVAL) {
            ticks.x.push(parseFloat(x.toFixed(1)));
        }

        const xAxisY = worldToCanvasY(WORLD_X_MIN); // Y-position of X-axis
        const yAxisX = worldToCanvasX(WORLD_Y_MIN); // X-position of Y-axis

        const elements = [];

        // Grid Lines
        ticks.y.forEach((y, i) => {
            const x = worldToCanvasX(y);
            elements.push(<Line key={`v_grid_${i}`} points={[x, canvasOffsetY, x, stageH - canvasOffsetY]} stroke={GRID_COLOR} strokeWidth={0.5} dash={[2, 2]} listening={false}/>);
        });
        ticks.x.forEach((x, i) => {
            const y = worldToCanvasY(x);
            elements.push(<Line key={`h_grid_${i}`} points={[canvasOffsetX, y, stageW - canvasOffsetX, y]} stroke={GRID_COLOR} strokeWidth={0.5} dash={[2, 2]} listening={false}/>);
        });

        // Axes Lines (drawn on top of grid)
        elements.push(<Line key="x_axis" points={[canvasOffsetX, xAxisY, stageW - canvasOffsetX, xAxisY]} stroke={AXIS_COLOR} strokeWidth={AXIS_WIDTH} listening={false}/>);
        elements.push(<Line key="y_axis" points={[yAxisX, canvasOffsetY, yAxisX, stageH - canvasOffsetY]} stroke={AXIS_COLOR} strokeWidth={AXIS_WIDTH} listening={false}/>);

        // X-Axis Ticks & Labels
        ticks.y.forEach((y, i) => {
            const x = worldToCanvasX(y);
            elements.push(<Line key={`x_tick_${i}`} points={[x, xAxisY - 4, x, xAxisY + 4]} stroke={AXIS_COLOR} strokeWidth={TICK_WIDTH} listening={false}/>);
            elements.push(<Text key={`x_label_${i}`} x={x} y={xAxisY + 7} text={y.toFixed(1)} fontSize={LABEL_FONT_SIZE} fill={LABEL_COLOR} offsetX={LABEL_FONT_SIZE * y.toFixed(1).length / 4} listening={false}/>);
        });

        // Y-Axis Ticks & Labels
        ticks.x.forEach((x, i) => {
            const y = worldToCanvasY(x);
            elements.push(<Line key={`y_tick_${i}`} points={[yAxisX - 4, y, yAxisX + 4, y]} stroke={AXIS_COLOR} strokeWidth={TICK_WIDTH} listening={false}/>);
            elements.push(<Text key={`y_label_${i}`} x={yAxisX - 30} y={y} text={x.toFixed(1)} fontSize={LABEL_FONT_SIZE} fill={LABEL_COLOR} offsetY={LABEL_FONT_SIZE / 2} width={25} align="right" listening={false}/>);
        });

         // Axis Titles
        elements.push(<Text key="x_title" x={stageW / 2} y={AXIS_PADDING} text="World Y" fontSize={LABEL_FONT_SIZE + 1} fill="black" listening={false} />);
        elements.push(<Text key="y_title" x={AXIS_PADDING} y={stageH / 2} text="World X" fontSize={LABEL_FONT_SIZE + 1} fill="black" rotation={-90} listening={false}/>);


        return elements;
    };


  return (
    <div className="app-container">
        {/* --- Left Column --- */}
        <div className="column left-column">
          <div className="section">
                  <h2>Task</h2>
                   <div className="input-group">
                       <input
                           type="text"
                           placeholder="Enter Scene ID"
                           value={sceneId}
                           onChange={(e) => setSceneId(e.target.value)}
                           list="scene-ids" // Link to datalist
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

        {/* --- Center Column --- */}
        <div className="column center-column" ref={centerColRef}>
             <Stage
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                ref={stageRef}
             >
                <Layer ref={layerRef}>
                   {/* Render Axes and Grid */}
                   {renderAxesAndGrid()}

                    {/* Render Objects */}
                    {sceneData && sceneData.objects.map(obj => {
                        const isSelected = obj.id === selectedId;
                        // Use size[1] for width (Y) and size[0] for height (X)
                        const rectCanvasWidth = obj.size[0] * worldToCanvasScale;
                        const rectCanvasHeight = obj.size[1] * worldToCanvasScale;
                        // Use worldToCanvasX for Y and worldToCanvasY for X
                        const groupCanvasX = worldToCanvasX(obj.position[1]);
                        const groupCanvasY = worldToCanvasY(obj.position[0]);
                        const isDraggable = (currentAction === 'PUT_NEAR' && actionState === 'MANIPULATE' && isSelected);


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
                                offsetX={0} // Offset set on Rect/Text
                                offsetY={0}
                            >
                                <Rect
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    fill={getObjectColor(obj.category)}
                                    stroke={isSelected && currentAction !== null ? '#FF0000' : (obj.id === referenceId && currentAction !== null ? '#0000FF' : '#333333')}
                                    strokeWidth={isSelected && currentAction !== null ? 2.5 : (obj.id === referenceId && currentAction !== null ? 2 : 1)}
                                    shadowBlur={isSelected && currentAction !== null ? 8 : 0}
                                    shadowColor={isSelected && currentAction !== null ? '#FF4500' : 'transparent'}
                                    offsetX={rectCanvasWidth / 2}
                                    offsetY={rectCanvasHeight / 2}
                                    opacity={0.65}
                                />
                                <Text
                                    text={obj.name}
                                    fontSize={LABEL_FONT_SIZE - 1} // Slightly smaller text
                                    fill="#000000"
                                    align="center"
                                    verticalAlign="middle"
                                    width={rectCanvasWidth}
                                    height={rectCanvasHeight}
                                    offsetX={rectCanvasWidth / 2}
                                    offsetY={rectCanvasHeight / 2}
                                    listening={false} // Text doesn't capture clicks
                                    padding={1}
                                    wrap="char" // Wrap if needed (less likely here)
                                />
                            </Group>
                        );
                    })}
                    <Transformer
                        ref={trRef}
                        keepRatio={false} // Allow rotation without keeping ratio
                        anchorStroke="#FF0000"
                        anchorFill="#FFFFFF"
                        anchorSize={8}
                        borderStroke="#FF0000"
                        borderDash={[4, 4]}
                        rotateAnchorOffset={20}
                        enabledAnchors={[]} // Only rotation enabled
                        rotateEnabled={true}
                    />
                </Layer>
            </Stage>
        </div>

        {/* --- Right Column --- */}
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
                <h2>Trajectory</h2>
                <pre className="trajectory-pre">{JSON.stringify(trajectory, null, 2)}</pre>
             </div>

        </div>
    </div>
  );
};

export default App;