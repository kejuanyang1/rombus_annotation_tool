import React, { useState, useEffect, useCallback } from 'react';
import SceneSelector from './components/SceneSelector';
import JSPlotter from './components/JSPlotter';
import { getSceneData, saveTrajectory } from './services/api';
import { calculateVertices } from './utils/geometry';
import './App.css';

const OBJECT_COLORS = {
    lid: 'rgba(255, 107, 107, 0.5)',
    bowl: 'rgba(78, 205, 196, 0.5)',
    basket: 'rgba(69, 183, 209, 0.5)',
    support: 'rgba(247, 184, 1, 0.5)',
    base: 'rgba(160, 122, 91, 0.5)',
    default: 'rgba(150, 150, 150, 0.5)',
};

const MIN_MAIN_ID = 1;
const MAX_MAIN_ID = 80;
const MIN_SUB_ID = 0;
const MAX_SUB_ID = 2;

const parseTaskId = (taskId) => {
    if (!taskId || typeof taskId !== 'string' || !taskId.includes('_')) return null;
    const parts = taskId.split('_');
    if (parts.length !== 2) return null;
    const main = parseInt(parts[0], 10);
    const sub = parseInt(parts[1], 10);
    if (isNaN(main) || isNaN(sub)) return null;
    return { main, sub };
};

const formatTaskId = (main, sub) => {
    const mainStr = main.toString().padStart(2, '0');
    return `${mainStr}_${sub}`;
};

const TABLE_LIMITS = {
    sceneX_min: 0,
    sceneX_max: 0.5,
    sceneY_min: -0.5,
    sceneY_max: 0.2
};

function App() {
    const [currentTaskId, setCurrentTaskId] = useState('01_0');
    const [sceneData, setSceneData] = useState(null);
    const [objects, setObjects] = useState([]);
    const [interactionHistory, setInteractionHistory] = useState([]);
    const [error, setError] = useState('');

    const [primarySelectedObjectId, setPrimarySelectedObjectId] = useState(null);
    const [referenceSelectedObjectId, setReferenceSelectedObjectId] = useState(null);

    const [dragContext, setDragContext] = useState(null);
    const [previewObjectPosition, setPreviewObjectPosition] = useState(null);

    const clearSelections = useCallback(() => {
        setPrimarySelectedObjectId(null);
        setReferenceSelectedObjectId(null);
        setDragContext(null);
        setPreviewObjectPosition(null);
    }, []);

    const fetchScene = useCallback(async (taskIdToFetch) => {
        if (!taskIdToFetch) { console.warn("fetchScene called with no taskIdToFetch"); return; }
        const parsedId = parseTaskId(taskIdToFetch);
        if (!parsedId || parsedId.main < MIN_MAIN_ID || parsedId.main > MAX_MAIN_ID || parsedId.sub < MIN_SUB_ID || parsedId.sub > MAX_SUB_ID) {
            setError(`Invalid scene ID format or range: ${taskIdToFetch}`); return;
        }
        try {
            setError(''); clearSelections();
            const response = await getSceneData(taskIdToFetch);
            console.log("Backend Response Data:", response.data);
            setSceneData(response.data);
            if (response.data && response.data.objects) {
                const initialObjects = response.data.objects.map(obj => ({
                    ...obj,
                    verts: obj.initial_verts || calculateVertices(obj.scene_x, obj.scene_y, obj.size_sx, obj.size_sy, obj.orientation),
                    color: OBJECT_COLORS[obj.name.toLowerCase().split(" ").find(word => OBJECT_COLORS[word])] || OBJECT_COLORS[obj.name.toLowerCase().split(" ")[0]] || OBJECT_COLORS.default,
                }));
                setObjects(initialObjects);
            } else { setObjects([]); }
            setInteractionHistory([]);
        } catch (err) {
            setError(`Failed to load scene data for ${taskIdToFetch}. Ensure backend is running. Check console.`);
            console.error("Fetch Scene Error for " + taskIdToFetch + ":", err);
        }
    }, [clearSelections]);

    useEffect(() => {
        if (currentTaskId) { fetchScene(currentTaskId); }
    }, [currentTaskId, fetchScene]);

    const handleObjectUpdate = (updatedObj) => {
        setObjects(prevObjects => prevObjects.map(obj => obj.id === updatedObj.id ? updatedObj : obj));
    };
    const recordAction = (action) => {
        setInteractionHistory(prev => [...prev, action]);
    };
    const handleSaveTrajectory = async () => {
        if (!sceneData || !sceneData.taskId || interactionHistory.length === 0) { alert("No interactions to save or no scene loaded."); return; }
        try {
            await saveTrajectory(sceneData.taskId, { scene_id: sceneData.taskId, actions: interactionHistory });
            alert(`Trajectory for scene ${sceneData.taskId} saved!`);
        } catch (err) { alert('Failed to save trajectory.'); console.error("Save Trajectory Error:", err); }
    };
    
    const handleObjectClickForSelection = (objectId) => {
        if (dragContext) return; 
        const isPlotActive = sceneData?.plotMetadata?.plot_target_width !== undefined;
        if (isPlotActive) {
            if (!primarySelectedObjectId || primarySelectedObjectId === objectId) {
                setPrimarySelectedObjectId(prev => (prev === objectId ? null : objectId));
                setReferenceSelectedObjectId(null);
            } else if (!referenceSelectedObjectId || referenceSelectedObjectId === objectId) {
                setReferenceSelectedObjectId(prev => (prev === objectId ? null : objectId));
            }
        } else { console.warn("Plot area metadata not fully loaded, selection disabled.");}
    };
    const handleCategoricalAction = (actionType) => {
        if (!primarySelectedObjectId || !referenceSelectedObjectId) { alert("Please select a primary and a reference object."); return; }
        const primaryObj = objects.find(o => o.id === primarySelectedObjectId);
        const referenceObj = objects.find(o => o.id === referenceSelectedObjectId);
        if (!primaryObj || !referenceObj) { alert("Selected objects not found."); return; }
        let actionDetails = {};
        let updatedObjectState = { ...primaryObj };
        const primaryName = primaryObj.name.toLowerCase();
        const referenceName = referenceObj.name.toLowerCase();
        switch (actionType) {
            case 'CLOSE_LID':
                if (!primaryName.includes('lid') || !referenceName.includes('bowl')) { alert("For 'Close Lid', primary must be 'lid' and reference 'bowl'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x; updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetails = { type: 'CLOSE_LID', lidId: primaryObj.id, bowlId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            case 'OPEN_LID':
                if (!primaryName.includes('lid') || !referenceName.includes('bowl')) { alert("For 'Open Lid', primary must be 'lid' and reference 'bowl'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x - (referenceObj.size_sy * 0.7); updatedObjectState.scene_y = referenceObj.scene_y - (referenceObj.size_sx * 0.3);
                actionDetails = { type: 'OPEN_LID', lidId: primaryObj.id, bowlId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            case 'IN_BASKET':
                if (!referenceName.includes('basket')) { alert("Reference must be a 'basket' for 'Put In Basket'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x; updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetails = { type: 'IN_BASKET', objectId: primaryObj.id, basketId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            case 'ON_SUPPORT':
                if (!referenceName.includes('support')) { alert("Reference must be a 'support' for 'Place On Support'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x; updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetails = { type: 'ON_SUPPORT', objectId: primaryObj.id, supportId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            default: return;
        }
        updatedObjectState.verts = calculateVertices(updatedObjectState.scene_x, updatedObjectState.scene_y, updatedObjectState.size_sx, updatedObjectState.size_sy, updatedObjectState.orientation);
        handleObjectUpdate(updatedObjectState);
        recordAction(actionDetails);
    };

    const initiateTranslationalDrag = (direction) => {
        if (!primarySelectedObjectId || !referenceSelectedObjectId) { alert("Please select a primary object to move AND a reference object to define the axis."); return; }
        const objectToMove = objects.find(o => o.id === primarySelectedObjectId);
        const refObject = objects.find(o => o.id === referenceSelectedObjectId);
        if (!objectToMove || !refObject) { alert("Selected object(s) not found."); return; }
        let axisToDrag; let fixedCoordinateValue;
        switch (direction) {
            case 'UP': case 'DOWN': axisToDrag = 'scene_x'; fixedCoordinateValue = refObject.scene_y; break;
            case 'LEFT': case 'RIGHT': axisToDrag = 'scene_y'; fixedCoordinateValue = refObject.scene_x; break;
            default: return;
        }
        setDragContext({ objectId: objectToMove.id, originalSceneX: objectToMove.scene_x, originalSceneY: objectToMove.scene_y, sizeSx: objectToMove.size_sx, sizeSy: objectToMove.size_sy, orientation: objectToMove.orientation, color: objectToMove.color, label: objectToMove.label, axisToDrag: axisToDrag, fixedCoordinateValue: fixedCoordinateValue, });
        let initialPreviewX = objectToMove.scene_x; let initialPreviewY = objectToMove.scene_y;
        if (axisToDrag === 'scene_x') { initialPreviewY = fixedCoordinateValue; } else { initialPreviewX = fixedCoordinateValue; }
        setPreviewObjectPosition({ scene_x: initialPreviewX, scene_y: initialPreviewY });
    };

    // MODIFIED: handlePlotMouseMoveForDrag to clamp center position
    const handlePlotMouseMoveForDrag = (mousePlotXData_sceneY, mousePlotYData_sceneX) => {
        if (!dragContext) return; // dragContext includes fixedCoordinateValue from reference object
        
        let newPreviewSceneX;
        let newPreviewSceneY;

        // Determine the new potential center based on mouse and constrained axis
        if (dragContext.axisToDrag === 'scene_x') { // Dragging along plot's Y-axis (scene_x data changes)
            newPreviewSceneX = mousePlotYData_sceneX;    // mousePlotYData_sceneX is the SCENE X value from mouse
            newPreviewSceneY = dragContext.fixedCoordinateValue; // SCENE Y of primary is fixed
        } else { // axisToDrag === 'scene_y', dragging along plot's X-axis (scene_y data changes)
            newPreviewSceneY = mousePlotXData_sceneY;    // mousePlotXData_sceneY is the SCENE Y value from mouse
            newPreviewSceneX = dragContext.fixedCoordinateValue; // SCENE X of primary is fixed
        }

        // --- Directly clamp the CENTER position ---
        const clampedSceneX = Math.max(TABLE_LIMITS.sceneX_min, Math.min(newPreviewSceneX, TABLE_LIMITS.sceneX_max));
        const clampedSceneY = Math.max(TABLE_LIMITS.sceneY_min, Math.min(newPreviewSceneY, TABLE_LIMITS.sceneY_max));
        
        setPreviewObjectPosition({ scene_x: clampedSceneX, scene_y: clampedSceneY });
    };

    const handlePlotClickToFinalizeMove = () => {
        if (!dragContext || !previewObjectPosition) return;
        const objectToUpdate = objects.find(o => o.id === dragContext.objectId);
        if (!objectToUpdate) { console.error("Original object not found."); setDragContext(null); setPreviewObjectPosition(null); return; }
        // The previewObjectPosition already holds the clamped center coordinates
        const finalUpdatedObject = { 
            ...objectToUpdate, 
            scene_x: previewObjectPosition.scene_x, 
            scene_y: previewObjectPosition.scene_y, 
            verts: calculateVertices(previewObjectPosition.scene_x, previewObjectPosition.scene_y, objectToUpdate.size_sx, objectToUpdate.size_sy, objectToUpdate.orientation), 
        };
        handleObjectUpdate(finalUpdatedObject);
        recordAction({ type: 'MOVE_OBJECT_TO', objectId: dragContext.objectId, new_pos: [previewObjectPosition.scene_x, previewObjectPosition.scene_y], });
        setDragContext(null); setPreviewObjectPosition(null);
    };

    let currentPreviewObjectForPlotter = null;
    if (dragContext && previewObjectPosition) {
        currentPreviewObjectForPlotter = { 
            id: `${dragContext.objectId}-preview`, 
            scene_x: previewObjectPosition.scene_x, // This is the clamped center
            scene_y: previewObjectPosition.scene_y, // This is the clamped center
            size_sx: dragContext.sizeSx, 
            size_sy: dragContext.sizeSy, 
            orientation: dragContext.orientation, 
            verts: calculateVertices(previewObjectPosition.scene_x, previewObjectPosition.scene_y, dragContext.sizeSx, dragContext.sizeSy, dragContext.orientation), 
            color: dragContext.color ? dragContext.color.replace('0.5', '0.25') : 'rgba(100,100,255,0.25)', 
            label: `${dragContext.label} (preview)`, 
        };
    }

    const handlePreviousScene = () => {
        const parsed = parseTaskId(currentTaskId);
        if (!parsed) {
            console.error("Cannot navigate: currentTaskId is invalid or unparseable.", currentTaskId);
            return;
        }

        let { main, sub } = parsed;

        if (main === MIN_MAIN_ID && sub === MIN_SUB_ID) {
            // Already at the very first scene
            return;
        }

        if (sub > MIN_SUB_ID) {
            sub--;
        } else {
            // Reached sub ID 0, go to previous main ID and max sub ID
            sub = MAX_SUB_ID;
            main--;
            // Ensure main doesn't go below MIN_MAIN_ID (though the initial check should cover this)
            if (main < MIN_MAIN_ID) {
                // This case should ideally not be reached if the first check is correct
                main = MIN_MAIN_ID; 
                sub = MIN_SUB_ID;
            }
        }
        const newTaskId = formatTaskId(main, sub);
        setCurrentTaskId(newTaskId); // This will trigger the useEffect to fetch the scene
    };

    const handleNextScene = () => {
        const parsed = parseTaskId(currentTaskId);
        if (!parsed) {
            console.error("Cannot navigate: currentTaskId is invalid or unparseable.", currentTaskId);
            return;
        }

        let { main, sub } = parsed;

        if (main === MAX_MAIN_ID && sub === MAX_SUB_ID) {
            // Already at the very last scene
            return;
        }

        if (sub < MAX_SUB_ID) {
            sub++;
        } else {
            // Reached max sub ID, go to next main ID and min sub ID
            sub = MIN_SUB_ID;
            main++;
            // Ensure main doesn't go above MAX_MAIN_ID (though the initial check should cover this)
            if (main > MAX_MAIN_ID) {
                // This case should ideally not be reached
                main = MAX_MAIN_ID;
                sub = MAX_SUB_ID;
            }
        }
        const newTaskId = formatTaskId(main, sub);
        setCurrentTaskId(newTaskId); // This will trigger the useEffect to fetch the scene
    };

    const isAtFirstScene = () => {
        const parsed = parseTaskId(currentTaskId);
        return parsed ? (parsed.main === MIN_MAIN_ID && parsed.sub === MIN_SUB_ID) : true; // Disable if currentTaskId is invalid
    };

    const isAtLastScene = () => {
        const parsed = parseTaskId(currentTaskId);
        return parsed ? (parsed.main === MAX_MAIN_ID && parsed.sub === MAX_SUB_ID) : true; // Disable if currentTaskId is invalid
    };

    const getObjectDisplayLabel = (objectId) => {
        if (!objectId) return 'None';
        const selectedObject = objects.find(obj => obj.id === objectId);
        return selectedObject ? selectedObject.label : `ID: ${objectId} (Not found)`;
    };



    return (
        <div className="App">
            <h1>Bounding Box Manipulator</h1>
            <div className="scene-navigation-controls">
                {/* ... Nav buttons and SceneSelector ... */}
                <button onClick={handlePreviousScene} disabled={isAtFirstScene()} className="control-button nav-button"> &lt; Prev </button>
                <SceneSelector currentTaskId={currentTaskId} onSetCurrentTaskId={setCurrentTaskId} />
                <button onClick={handleNextScene} disabled={isAtLastScene()} className="control-button nav-button"> Next &gt; </button>
            </div>

            {error && <p className="error">{error}</p>}

            {sceneData && (
                <div>
                    <h2>Scene: {sceneData.taskId}</h2>
                    <div className="app-layout">
                        <div className="main-visuals-stack">
                            {/* ... Original Image and JSPlotter rendering ... */}
                            <div className="original-image-container">
                                {sceneData.originalImageSrc ? ( <img src={`http://localhost:3001${sceneData.originalImageSrc}`} alt={`Original Scene ${sceneData.taskId}`} style={{maxWidth: '100%', maxHeight: sceneData.plotMetadata?.plot_target_height ? `${sceneData.plotMetadata.plot_target_height}px` : '600px', height: 'auto', border: '1px solid #ccc', objectFit: 'contain', display: 'block', margin: '0 auto' }} />) : 
                                (<div className="placeholder-box" style={{width: sceneData.plotMetadata?.plot_target_width ? `${sceneData.plotMetadata.plot_target_width}px` : '600px', height: '400px'}}>Original Image Area (Not Available)</div>
                                )}
                            </div>
                            <div className="js-plot-container">
                                {sceneData.plotMetadata ? (
                                    <JSPlotter
                                        objects={objects}
                                        plotMetadata={sceneData.plotMetadata}
                                        selectedObjectIds={{ primary: primarySelectedObjectId, reference: referenceSelectedObjectId }}
                                        onObjectClick={handleObjectClickForSelection}
                                        isDraggingActive={!!dragContext}
                                        onPlotMouseMove={dragContext ? handlePlotMouseMoveForDrag : null}
                                        onPlotClick={dragContext ? handlePlotClickToFinalizeMove : null}
                                        previewObject={currentPreviewObjectForPlotter}
                                    />
                                ) : ( <div className="placeholder-box" style={{width: '600px', height: '600px'}}> Plot Area (Waiting for Plot Metadata) </div> )}
                            </div>
                        </div>
                        <div className="controls-panel-container">
                             <div className="controls-panel">
                                {/* ... Controls Panel JSX (Selection, Trajectory, Operations) ... */}
                                <div className="controls-top-row">
                                   <div className="selection-status-block">
                                        <h4>Selection Status:</h4>
                                        <p>Primary Object: <span className="selected-id">{getObjectDisplayLabel(primarySelectedObjectId)}</span></p>
                                        <p>Reference Object: <span className="selected-id">{getObjectDisplayLabel(referenceSelectedObjectId)}</span></p>
                                        <button onClick={clearSelections} className="control-button">Clear All Selections</button>
                                    </div>
                                    <div className="trajectory-section-block">
                                        <h3>Interaction History:</h3>
                                        <pre className="interaction-history-box">{JSON.stringify(interactionHistory, null, 2)}</pre>
                                        <button onClick={handleSaveTrajectory} disabled={interactionHistory.length === 0} className="control-button save-button">Save Trajectory</button>
                                    </div>
                                </div>
                                <hr className="controls-separator" />

                                {primarySelectedObjectId && referenceSelectedObjectId && (
                                    <>
                                        <h4>Available Operations:</h4>
                                        <div className="actions-main-container">
                                            <div className="operation-section categorical-ops">
                                                  <h5>Categorical Actions:</h5>
                                                  <p className="instruction-small">Primary = object to act. Reference = target.</p>
                                                  <button className="control-button action-button" onClick={() => handleCategoricalAction('OPEN_LID')}>Open Lid</button>
                                                  <button className="control-button action-button" onClick={() => handleCategoricalAction('CLOSE_LID')}>Close Lid</button>
                                                  <button className="control-button action-button" onClick={() => handleCategoricalAction('IN_BASKET')}>Put In Basket</button>
                                                  <button className="control-button action-button" onClick={() => handleCategoricalAction('ON_SUPPORT')}>Place On Support</button>
                                            </div>
                                            <div className="operation-section translational-ops-setup">
                                                <h5>Translational Movement (Primary Object):</h5>
                                                {dragContext ? (
                                                    <>
                                                        <p className="instruction-small drag-active-text">Drag '{dragContext.label}' along axis defined by Reference. Click plot to place.</p>
                                                        <button onClick={() => { setDragContext(null); setPreviewObjectPosition(null); }} className="control-button cancel-drag-button">Cancel Move</button>
                                                    </>
                                                ) : (
                                                    <>
                                                      <p className="instruction-small">Select direction to move Primary along Reference's axis.</p>
                                                      <div className="direction-controls">
                                                          <button onClick={() => initiateTranslationalDrag('UP')} className="control-button direction-button">Up</button>
                                                          <button onClick={() => initiateTranslationalDrag('DOWN')} className="control-button direction-button">Down</button>
                                                          <button onClick={() => initiateTranslationalDrag('LEFT')} className="control-button direction-button">Left</button>
                                                          <button onClick={() => initiateTranslationalDrag('RIGHT')} className="control-button direction-button">Right</button>
                                                      </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="controls-separator" />
                                    </>
                                )}
                                {/* Instructional Text */}
                                {!primarySelectedObjectId && <p className="instruction">1. Select a primary object from the plot.</p>}
                                {primarySelectedObjectId && !referenceSelectedObjectId && !dragContext && <p className="instruction">2. Select a reference object for operations.</p>}
                                {primarySelectedObjectId && referenceSelectedObjectId && !dragContext && <p className="instruction">3. Choose an operation above.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!sceneData && <p style={{textAlign: 'center', marginTop: '20px'}}>Please load a scene to begin.</p>}
        </div>
    );
}
export default App;