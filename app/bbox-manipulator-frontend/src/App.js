import React, { useState, useCallback } from 'react';
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

function App() {
    const [currentTaskId, setCurrentTaskId] = useState('');
    const [sceneData, setSceneData] = useState(null);
    const [objects, setObjects] = useState([]);
    const [interactionHistory, setInteractionHistory] = useState([]);
    const [error, setError] = useState('');

    const [primarySelectedObjectId, setPrimarySelectedObjectId] = useState(null);
    const [referenceSelectedObjectId, setReferenceSelectedObjectId] = useState(null);
    // currentOperationMode is no longer needed for this display logic
    // const [currentOperationMode, setCurrentOperationMode] = useState(null);
    const [moveDirection, setMoveDirection] = useState('');
    const [moveDistance, setMoveDistance] = useState(0.1);

    const fetchScene = useCallback(async (taskId) => {
        if (!taskId) return;
        try {
            setError('');
            clearSelections(); // Clear selections when a new scene is loaded
            const response = await getSceneData(taskId);
            console.log("Backend Response Data:", response.data);
            setSceneData(response.data);

            if (response.data && response.data.objects) {
                const initialObjects = response.data.objects.map(obj => ({
                    ...obj,
                    verts: obj.initial_verts || calculateVertices(obj.scene_x, obj.scene_y, obj.size_sx, obj.size_sy, obj.orientation),
                    color: OBJECT_COLORS[obj.name.toLowerCase().split(" ").find(word => OBJECT_COLORS[word])] ||
                           OBJECT_COLORS[obj.name.toLowerCase().split(" ")[0]] ||
                           OBJECT_COLORS.default,
                }));
                setObjects(initialObjects);
            } else {
                setObjects([]);
            }
            setInteractionHistory([]);
        } catch (err) {
            setError('Failed to load scene data. Ensure backend is running and task ID is valid. Check console for details.');
            console.error("Fetch Scene Error:", err);
            setSceneData(null);
            setObjects([]);
            clearSelections();
        }
    }, []);

    const handleObjectUpdate = (updatedObj) => {
        setObjects(prevObjects =>
            prevObjects.map(obj => obj.id === updatedObj.id ? updatedObj : obj)
        );
    };

    const recordAction = (action) => {
        setInteractionHistory(prev => [...prev, action]);
    };

    const handleSaveTrajectory = async () => {
        if (!sceneData || !sceneData.taskId || interactionHistory.length === 0) {
            alert("No interactions to save or no scene loaded.");
            return;
        }
        try {
            await saveTrajectory(sceneData.taskId, {
                scene_id: sceneData.taskId,
                actions: interactionHistory
            });
            alert(`Trajectory for scene ${sceneData.taskId} saved!`);
        } catch (err) {
            alert('Failed to save trajectory.');
            console.error("Save Trajectory Error:", err);
        }
    };

    const clearSelections = () => {
        setPrimarySelectedObjectId(null);
        setReferenceSelectedObjectId(null);
        // setCurrentOperationMode(null); // No longer needed for this
        setMoveDirection('');
        // setMoveDistance(0.1); // Optionally reset
    };

    const handleObjectClickForSelection = (objectId) => {
        const isPlotActive = sceneData?.plotMetadata?.plot_target_width !== undefined;
        if (isPlotActive) {
            if (!primarySelectedObjectId || primarySelectedObjectId === objectId) {
                setPrimarySelectedObjectId(prev => (prev === objectId ? null : objectId));
                setReferenceSelectedObjectId(null);
            } else if (!referenceSelectedObjectId || referenceSelectedObjectId === objectId) {
                setReferenceSelectedObjectId(prev => (prev === objectId ? null : objectId));
            }
            // Removed setCurrentOperationMode(null) as it's not driving this part of UI
        } else {
            console.warn("Plot area metadata not fully loaded, selection disabled.");
        }
    };

    const handleCategoricalAction = (actionType) => {
        if (!primarySelectedObjectId || !referenceSelectedObjectId) {
            alert("Please select a primary and a reference object."); return;
        }
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
                updatedObjectState.scene_x = referenceObj.scene_x;
                updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetails = { type: 'CLOSE_LID', lidId: primaryObj.id, bowlId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            case 'OPEN_LID':
                if (!primaryName.includes('lid') || !referenceName.includes('bowl')) { alert("For 'Open Lid', primary must be 'lid' and reference 'bowl'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x - (referenceObj.size_sy * 0.7);
                updatedObjectState.scene_y = referenceObj.scene_y - (referenceObj.size_sx * 0.3);
                actionDetails = { type: 'OPEN_LID', lidId: primaryObj.id, bowlId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            case 'IN_BASKET':
                if (!referenceName.includes('basket')) { alert("Reference must be a 'basket' for 'Put In Basket'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x;
                updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetails = { type: 'IN_BASKET', objectId: primaryObj.id, basketId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            case 'ON_SUPPORT':
                if (!referenceName.includes('support')) { alert("Reference must be a 'support' for 'Place On Support'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x;
                updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetails = { type: 'ON_SUPPORT', objectId: primaryObj.id, supportId: referenceObj.id, new_pos: [updatedObjectState.scene_x, updatedObjectState.scene_y] };
                break;
            default: return;
        }
        updatedObjectState.verts = calculateVertices(updatedObjectState.scene_x, updatedObjectState.scene_y, updatedObjectState.size_sx, updatedObjectState.size_sy, updatedObjectState.orientation);
        handleObjectUpdate(updatedObjectState);
        recordAction(actionDetails);
    };

    const executeTranslationalMove = () => {
        if (!primarySelectedObjectId || !referenceSelectedObjectId || !moveDirection || !(parseFloat(moveDistance) > 0)) {
            alert("Please select objects, direction, and valid distance."); return;
        }
        const objectToMove = objects.find(o => o.id === primarySelectedObjectId);
        const targetObject = objects.find(o => o.id === referenceSelectedObjectId);
        if (!objectToMove || !targetObject) { alert("Selected objects not found for move."); return; }

        let newX = objectToMove.scene_x;
        let newY = objectToMove.scene_y;
        const dist = parseFloat(moveDistance);

        switch (moveDirection) {
            case 'UP':    newX = targetObject.scene_x - dist; newY = targetObject.scene_y; break;
            case 'DOWN':  newX = targetObject.scene_x + dist; newY = targetObject.scene_y; break;
            case 'LEFT':  newY = targetObject.scene_y - dist; newX = targetObject.scene_x; break;
            case 'RIGHT': newY = targetObject.scene_y + dist; newX = targetObject.scene_x; break;
            default: return;
        }
        const updatedObject = { ...objectToMove, scene_x: newX, scene_y: newY };
        updatedObject.verts = calculateVertices(updatedObject.scene_x, updatedObject.scene_y, updatedObject.size_sx, updatedObject.size_sy, updatedObject.orientation);
        handleObjectUpdate(updatedObject);
        recordAction({ type: 'MOVE_NEAR', objectId: primarySelectedObjectId, targetId: referenceSelectedObjectId, direction: moveDirection, distance: dist, new_pos: [newX, newY] });
    };

    // Helper function to get object label by ID
    const getObjectDisplayLabel = (objectId) => {
        if (!objectId) return 'None';
        const selectedObject = objects.find(obj => obj.id === objectId);
        return selectedObject ? selectedObject.label : `ID: ${objectId} (Not found)`; // Display label, or ID if not found
    };

    return (
        <div className="App">
            <h1>Bounding Box Manipulator</h1>
            <SceneSelector onSelectScene={fetchScene} setCurrentTaskId={setCurrentTaskId} currentTaskId={currentTaskId} />
            {error && <p className="error">{error}</p>}

            {sceneData && (
                <div>
                    {/* Scene Title (h2) - REMOVED FROM HERE, as it's better placed once inside the layout if needed */}
                    {/* <h2 >Scene: {sceneData.taskId}</h2> */}
                    <div className="app-layout">
                        <div className="main-visuals-stack">
                            <div className="js-plot-container">
                                {sceneData.plotMetadata ? (
                                    <JSPlotter
                                        objects={objects}
                                        plotMetadata={sceneData.plotMetadata}
                                        selectedObjectIds={{ primary: primarySelectedObjectId, reference: referenceSelectedObjectId }}
                                        onObjectClick={handleObjectClickForSelection}
                                    />
                                ) : (
                                    <div className="placeholder-box" style={{width: '600px', height: '600px'}}>
                                        Plot Area (Waiting for Plot Metadata)
                                    </div>
                                )}
                            </div>
                            <div className="original-image-container">
                                {sceneData.originalImageSrc ? (
                                    <img
                                        src={`http://localhost:3001${sceneData.originalImageSrc}`}
                                        alt={`Original Scene ${sceneData.taskId}`}
                                        style={{
                                            width: sceneData.plotMetadata?.plot_target_width ? `${sceneData.plotMetadata.plot_target_width}px` : '100%',
                                            maxHeight: '400px',
                                            height: 'auto',
                                            border: '1px solid #ccc',
                                            objectFit: 'contain',
                                            display: 'block',
                                            margin: '0 auto'
                                        }}
                                    />
                                ) : (
                                    <div className="placeholder-box" style={{width: sceneData.plotMetadata?.plot_target_width ? `${sceneData.plotMetadata.plot_target_width}px` : '600px', height: '400px'}}>
                                        Original Image Area (Not Available)
                                    </div>
                                )}
                            </div>
                        </div> {/* End main-visuals-stack */}

                        <div className="controls-panel-container">
                             <div className="controls-panel">
                                {/* New structure for top part of controls */}
                                <div className="controls-top-row">
                                    <div className="selection-status-block">
                                        <h4>Selection Status:</h4>
                                        <p>Primary Object: <span className="selected-id">{getObjectDisplayLabel(primarySelectedObjectId)}</span></p>
                                        <p>Reference Object: <span className="selected-id">{getObjectDisplayLabel(referenceSelectedObjectId)}</span></p>
                                        <button onClick={clearSelections} className="control-button">Clear All Selections</button>
                                    </div>

                                    <div className="trajectory-section-block"> {/* Trajectory moved here */}
                                        <h3>Interaction History:</h3>
                                        <pre className="interaction-history-box">{JSON.stringify(interactionHistory, null, 2)}</pre>
                                        <button onClick={handleSaveTrajectory} disabled={interactionHistory.length === 0} className="control-button save-button">
                                            Save Interaction Trajectory
                                        </button>
                                    </div>
                                </div>
                                <hr className="controls-separator" />

                                {primarySelectedObjectId && referenceSelectedObjectId && (
                                    <>
                                        <h4>Available Operations:</h4>
                                        <div className="actions-main-container">
                                            <div className="operation-section categorical-ops">
                                                <h5>Spatial:</h5>
                                                <button className="control-button action-button" onClick={() => handleCategoricalAction('OPEN_LID')}>Open Lid</button>
                                                <button className="control-button action-button" onClick={() => handleCategoricalAction('CLOSE_LID')}>Close Lid</button>
                                                <button className="control-button action-button" onClick={() => handleCategoricalAction('IN_BASKET')}>Put In Basket</button>
                                                <button className="control-button action-button" onClick={() => handleCategoricalAction('ON_SUPPORT')}>Place On Support</button>
                                            </div>

                                            <div className="operation-section translational-ops-setup">
                                                <h5>Translational:</h5>
                                                <div className="direction-controls">
                                                    <span>Direction:</span>
                                                    <button onClick={() => setMoveDirection('UP')} className={`control-button direction-button ${moveDirection === 'UP' ? 'active' : ''}`}>Up</button>
                                                    <button onClick={() => setMoveDirection('DOWN')} className={`control-button direction-button ${moveDirection === 'DOWN' ? 'active' : ''}`}>Down</button>
                                                    <button onClick={() => setMoveDirection('LEFT')} className={`control-button direction-button ${moveDirection === 'LEFT' ? 'active' : ''}`}>Left</button>
                                                    <button onClick={() => setMoveDirection('RIGHT')} className={`control-button direction-button ${moveDirection === 'RIGHT' ? 'active' : ''}`}>Right</button>
                                                </div>
                                                <div className="distance-control">
                                                    <label htmlFor="moveDistance">Distance (m): </label>
                                                    <input id="moveDistance" type="number" value={moveDistance} onChange={(e) => setMoveDistance(parseFloat(e.target.value) || 0)} step="0.01" min="0.01" className="distance-input"/>
                                                </div>
                                                <button onClick={executeTranslationalMove} disabled={!moveDirection || !(moveDistance > 0)} className="control-button action-button execute-move-button">Execute Move</button>
                                            </div>
                                        </div>
                                        <hr className="controls-separator" />
                                    </>
                                )}
                                
                                {/* Instructional paragraphs at the end */}
                                {!primarySelectedObjectId && <p className="instruction">1. Click an object in the plot area to select it as the primary object.</p>}
                                {primarySelectedObjectId && !referenceSelectedObjectId && <p className="instruction">2. Click another object in the plot area to select it as the reference object.</p>}
                                {(primarySelectedObjectId && referenceSelectedObjectId && (!objects.find(o=>o.id===primarySelectedObjectId) || !objects.find(o=>o.id===referenceSelectedObjectId))) &&
                                    <p className="instruction error-instruction">Warning: One or both selected objects might have been altered or are no longer distinctly selectable. Consider clearing selections.</p>
                                }
                                {primarySelectedObjectId && referenceSelectedObjectId && <p className="instruction">3. Choose an operation above.</p>}
                            </div>
                        </div> {/* End controls-panel-container */}
                    </div> {/* End app-layout */}

                    {/* Trajectory Section REMOVED from the bottom of the page */}
                </div>
            )}
             {!sceneData && <p style={{textAlign: 'center', marginTop: '20px'}}>Please load a scene to begin.</p>}
        </div>
    );
}
export default App;
    