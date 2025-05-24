import React, { useState, useEffect, useCallback } from 'react';
import SceneSelector from './components/SceneSelector';
// import JSPlotter from './components/JSPlotter'; // Original plotter
import CombinedPlotterSceneViewer from './components/CombinedPlotterSceneViewer'; // Combined component
import { getSceneData, saveTrajectory } from './services/api';
import { calculateVertices } from './utils/geometry';
import './App.css';

// Object colors remain the same
const OBJECT_COLORS = {
    lid: 'rgba(255, 107, 107, 0.5)',
    bowl: 'rgba(78, 205, 196, 0.5)',
    basket: 'rgba(69, 183, 209, 0.5)',
    support: 'rgba(247, 184, 1, 0.5)',
    base: 'rgba(160, 122, 91, 0.5)',
    default: 'rgba(150, 150, 150, 0.5)',
};

// Scene ID constants remain the same
const MIN_MAIN_ID = 1;
const MAX_MAIN_ID = 80;
const MIN_SUB_ID = 0;
const MAX_SUB_ID = 2;

// Helper functions (parseTaskId, formatTaskId, toDegrees, calculateRefDotFromVertices) remain the same
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

const toDegrees = (radians) => radians * (180 / Math.PI);

const calculateRefDotFromVertices = (verts) => {
    if (!verts || verts.length < 4) {
        return [0, 0]; 
    }
    const ref_dot_scene_y = (verts[0][0] + verts[3][0]) / 2;
    const ref_dot_scene_x = (verts[0][1] + verts[3][1]) / 2;
    return [ref_dot_scene_y, ref_dot_scene_x];
};

// Table limits constant, now the primary source for these boundaries
const TABLE_LIMITS = {
    sceneX_min: 0.0,  // Corresponds to plot's vertical axis min
    sceneX_max: 0.5,  // Corresponds to plot's vertical axis max
    sceneY_min: -0.6, // Corresponds to plot's horizontal axis min
    sceneY_max: 0.2   // Corresponds to plot's horizontal axis max
};

// --- Manually Defined Plot Configuration ---
// const MANUAL_PLOT_CONFIG = {
//     plot_target_width: 650,    // Width of the SVG plot area
//     plot_target_height: 375,   // Height of the SVG plot area
//     xlim: [TABLE_LIMITS.sceneY_min, TABLE_LIMITS.sceneY_max], 
//     ylim: [TABLE_LIMITS.sceneX_min, TABLE_LIMITS.sceneX_max], 

// };

const MANUAL_PLOT_CONFIG = {
    plot_target_width: 650,    // Width of the SVG plot area
    plot_target_height: 375,   // Height of the SVG plot area
    xlim: [TABLE_LIMITS.sceneY_min, TABLE_LIMITS.sceneY_max], 
    ylim: [TABLE_LIMITS.sceneX_min, TABLE_LIMITS.sceneX_max], 

};


function App() {
    const [currentTaskId, setCurrentTaskId] = useState('01_0');
    const [sceneData, setSceneData] = useState(null); // Will no longer store plotMetadata here
    const [objects, setObjects] = useState([]);
    const [interactionHistory, setInteractionHistory] = useState([]);
    const [error, setError] = useState('');

    const [primarySelectedObjectId, setPrimarySelectedObjectId] = useState(null);
    const [referenceSelectedObjectId, setReferenceSelectedObjectId] = useState(null);

    const [dragContext, setDragContext] = useState(null);
    const [rotationContext, setRotationContext] = useState(null);
    const [previewObjectState, setPreviewObjectState] = useState(null);

    const clearInteractions = useCallback(() => {
        setDragContext(null);
        setRotationContext(null);
        setPreviewObjectState(null);
    }, []);

    const clearSelections = useCallback(() => {
        setPrimarySelectedObjectId(null);
        setReferenceSelectedObjectId(null);
        clearInteractions();
    }, [clearInteractions]);

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
            
            // Set sceneData, but plotMetadata will come from MANUAL_PLOT_CONFIG
            const { plotMetadata, ...restOfSceneData } = response.data; 
            setSceneData(restOfSceneData); 

            if (response.data && response.data.objects) {
                const initialObjects = response.data.objects.map(obj => {
                    const orientationDegrees = obj.orientation || 0;
                    const verts = obj.initial_verts || calculateVertices(obj.scene_x, obj.scene_y, obj.size_sx, obj.size_sy, orientationDegrees);
                    const ref_dot = calculateRefDotFromVertices(verts);
                    return {
                        ...obj,
                        orientation: orientationDegrees,
                        verts: verts,
                        color: OBJECT_COLORS[obj.name.toLowerCase().split(" ").find(word => OBJECT_COLORS[word])] || OBJECT_COLORS[obj.name.toLowerCase().split(" ")[0]] || OBJECT_COLORS.default,
                        ref_dot: ref_dot,
                    };
                });
                setObjects(initialObjects);
            } else { setObjects([]); }
            setInteractionHistory([]);
        } catch (err) {
            setError(`Failed to load scene data for ${taskIdToFetch}. Ensure backend is running. Check console.`);
            console.error("Fetch Scene Error for " + taskIdToFetch + ":", err);
            setSceneData(null); 
            setObjects([]);
        }
    }, [clearSelections]);

    useEffect(() => {
        if (currentTaskId) { fetchScene(currentTaskId); }
    }, [currentTaskId, fetchScene]);

    const handleObjectUpdate = (updatedObj) => {
        const orientationDegrees = parseFloat(updatedObj.orientation || 0);
        const verts = calculateVertices(updatedObj.scene_x, updatedObj.scene_y, updatedObj.size_sx, updatedObj.size_sy, orientationDegrees);
        const ref_dot = calculateRefDotFromVertices(verts);
        const finalObj = {
            ...updatedObj,
            orientation: orientationDegrees,
            verts: verts,
            ref_dot: ref_dot,
        };
        setObjects(prevObjects => prevObjects.map(obj => obj.id === finalObj.id ? finalObj : obj));
        return finalObj;
    };

    const recordAction = (action) => {
        console.log("Recording action:", action);
        setInteractionHistory(prev => [...prev, action]);
    };
    
    const handleSaveTrajectory = async () => {
        if (!currentTaskId || interactionHistory.length === 0) { 
            alert("No interactions to save or no scene loaded properly."); 
            return; 
        }
        try {
            await saveTrajectory(currentTaskId, { scene_id: currentTaskId, actions: interactionHistory });
            alert(`Trajectory for scene ${currentTaskId} saved!`);
        } catch (err) { alert('Failed to save trajectory.'); console.error("Save Trajectory Error:", err); }
    };

    const handleObjectClickForSelection = (objectId) => {
        if (dragContext || rotationContext) return; 
        const isPlotActive = MANUAL_PLOT_CONFIG.plot_target_width !== undefined; 
        if (isPlotActive) {
            if (primarySelectedObjectId === objectId) {
                setPrimarySelectedObjectId(null); 
                setReferenceSelectedObjectId(null);
            } else if (referenceSelectedObjectId === objectId) {
                setReferenceSelectedObjectId(null);
            } else if (!primarySelectedObjectId) {
                setPrimarySelectedObjectId(objectId);
                setReferenceSelectedObjectId(null);
            } else { 
                setReferenceSelectedObjectId(objectId);
            }
        } else { console.warn("Plot area configuration not fully loaded, selection disabled.");}
    };

    const initiateImplicitRotation = (objectId) => {
        const objectToRotate = objects.find(o => o.id === objectId);
        if (objectToRotate && !dragContext) { 
            console.log(`Implicitly initiating rotation for ${objectId}`);
            setPrimarySelectedObjectId(objectToRotate.id); 
            setReferenceSelectedObjectId(null); 
            setRotationContext({
                objectId: objectToRotate.id,
                originalOrientationDegrees: objectToRotate.orientation,
                scene_x: objectToRotate.scene_x,
                scene_y: objectToRotate.scene_y,
                size_sx: objectToRotate.size_sx,
                size_sy: objectToRotate.size_sy,
                color: objectToRotate.color,
                label: objectToRotate.label || objectToRotate.name,
            });
            const verts = calculateVertices(objectToRotate.scene_x, objectToRotate.scene_y, objectToRotate.size_sx, objectToRotate.size_sy, objectToRotate.orientation);
            setPreviewObjectState({
                id: `${objectToRotate.id}-preview-rotate`,
                scene_x: objectToRotate.scene_x,
                scene_y: objectToRotate.scene_y,
                size_sx: objectToRotate.size_sx,
                size_sy: objectToRotate.size_sy,
                orientation: objectToRotate.orientation,
                verts: verts,
                ref_dot: calculateRefDotFromVertices(verts),
                color: objectToRotate.color ? objectToRotate.color.replace('0.5', '0.2') : 'rgba(120,120,255,0.2)',
                label: `${objectToRotate.label || objectToRotate.name} (rotating ${objectToRotate.orientation.toFixed(0)}°)`,
            });
        }
    };

    const handleCategoricalAction = (actionType) => {
        if (!primarySelectedObjectId || !referenceSelectedObjectId) { alert("Please select a primary and a reference object."); return; }
        const primaryObj = objects.find(o => o.id === primarySelectedObjectId);
        const referenceObj = objects.find(o => o.id === referenceSelectedObjectId);
        if (!primaryObj || !referenceObj) { alert("Selected objects not found."); return; }

        let updatedObjectState = { ...primaryObj };
        let newOrientationDegrees = primaryObj.orientation;
        let actionDetailsBase = { objectId: primaryObj.id, original_orientation: primaryObj.orientation };
        const primaryName = primaryObj.name.toLowerCase();
        const referenceName = referenceObj.name.toLowerCase();

        switch (actionType) {
            case 'CLOSE_LID':
                if (!primaryName.includes('lid') || !referenceName.includes('bowl')) { alert("For 'Close Lid', primary must be 'lid' and reference 'bowl'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x; 
                updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetailsBase = { ...actionDetailsBase, type: 'CLOSE_LID', lidId: primaryObj.id, bowlId: referenceObj.id };
                break;
            case 'OPEN_LID':
                if (!primaryName.includes('lid') || !referenceName.includes('bowl')) { alert("For 'Open Lid', primary must be 'lid' and reference 'bowl'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x - (referenceObj.size_sy * 0.7); 
                updatedObjectState.scene_y = referenceObj.scene_y - (referenceObj.size_sx * 0.3);
                actionDetailsBase = { ...actionDetailsBase, type: 'OPEN_LID', lidId: primaryObj.id, bowlId: referenceObj.id };
                break;
            case 'IN_BASKET':
                if (!referenceName.includes('basket')) { alert("Reference must be a 'basket' for 'Put In Basket'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x; 
                updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetailsBase = { ...actionDetailsBase, type: 'IN_BASKET', basketId: referenceObj.id};
                break;
            case 'ON_SUPPORT':
                if (!referenceName.includes('support')) { alert("Reference must be a 'support' for 'Place On Support'."); return; }
                updatedObjectState.scene_x = referenceObj.scene_x; 
                updatedObjectState.scene_y = referenceObj.scene_y;
                actionDetailsBase = { ...actionDetailsBase, type: 'ON_SUPPORT', supportId: referenceObj.id};
                break;
            default: 
                console.warn("Unknown categorical action:", actionType);
                return;
        }
        
        updatedObjectState.orientation = newOrientationDegrees;
        const finalUpdatedObj = handleObjectUpdate(updatedObjectState);

        recordAction({
            ...actionDetailsBase,
            new_pos: [finalUpdatedObj.scene_x, finalUpdatedObj.scene_y],
            new_orientation: finalUpdatedObj.orientation,
        });
        clearInteractions(); 
        initiateImplicitRotation(finalUpdatedObj.id);
    };

    const initiateTranslationalDrag = (direction) => {
        if (!primarySelectedObjectId || !referenceSelectedObjectId) { alert("Please select a primary object to move AND a reference object to define the axis."); return; }
        if (rotationContext) { clearInteractions(); }
        const objectToMove = objects.find(o => o.id === primarySelectedObjectId);
        const refObject = objects.find(o => o.id === referenceSelectedObjectId);
        if (!objectToMove || !refObject) { alert("Selected object(s) not found."); return; }

        let axisToDrag; let fixedCoordinateValue;
        switch (direction) {
            case 'UP': case 'DOWN': axisToDrag = 'scene_x'; fixedCoordinateValue = refObject.scene_y; break;
            case 'LEFT': case 'RIGHT': axisToDrag = 'scene_y'; fixedCoordinateValue = refObject.scene_x; break;
            default: return;
        }
        const currentOrientationDegrees = objectToMove.orientation || 0;
        setDragContext({
            objectId: objectToMove.id,
            originalSceneX: objectToMove.scene_x, originalSceneY: objectToMove.scene_y,
            sizeSx: objectToMove.size_sx, sizeSy: objectToMove.size_sy,
            orientation: currentOrientationDegrees, 
            color: objectToMove.color, label: objectToMove.label || objectToMove.name,
            axisToDrag: axisToDrag, fixedCoordinateValue: fixedCoordinateValue,
        });
        let initialPreviewX = objectToMove.scene_x; let initialPreviewY = objectToMove.scene_y;
        if (axisToDrag === 'scene_x') { initialPreviewY = fixedCoordinateValue; } else { initialPreviewX = fixedCoordinateValue; }
        
        const verts = calculateVertices(initialPreviewX, initialPreviewY, objectToMove.size_sx, objectToMove.size_sy, currentOrientationDegrees);
        setPreviewObjectState({ 
            id: `${objectToMove.id}-preview-drag`,
            scene_x: initialPreviewX, scene_y: initialPreviewY,
            size_sx: objectToMove.size_sx, size_sy: objectToMove.size_sy,
            orientation: currentOrientationDegrees,
            verts: verts,
            ref_dot: calculateRefDotFromVertices(verts),
            color: objectToMove.color ? objectToMove.color.replace('0.5', '0.25') : 'rgba(100,100,255,0.25)',
            label: `${objectToMove.label || objectToMove.name} (dragging)`,
        });
    };
    
    const handlePlotMouseMoveForDrag = (mousePlotXData_sceneY, mousePlotYData_sceneX) => {
        if (!dragContext) return;
        let newPreviewSceneX; let newPreviewSceneY;
        if (dragContext.axisToDrag === 'scene_x') {
            newPreviewSceneX = mousePlotYData_sceneX; newPreviewSceneY = dragContext.fixedCoordinateValue;
        } else {
            newPreviewSceneY = mousePlotXData_sceneY; newPreviewSceneX = dragContext.fixedCoordinateValue;
        }
        const clampedSceneX = Math.max(TABLE_LIMITS.sceneX_min, Math.min(newPreviewSceneX, TABLE_LIMITS.sceneX_max));
        const clampedSceneY = Math.max(TABLE_LIMITS.sceneY_min, Math.min(newPreviewSceneY, TABLE_LIMITS.sceneY_max));
        
        const verts = calculateVertices(clampedSceneX, clampedSceneY, dragContext.sizeSx, dragContext.sizeSy, dragContext.orientation);
        setPreviewObjectState({
            id: `${dragContext.objectId}-preview-drag`,
            scene_x: clampedSceneX, scene_y: clampedSceneY,
            size_sx: dragContext.sizeSx, size_sy: dragContext.sizeSy,
            orientation: dragContext.orientation,
            verts: verts,
            ref_dot: calculateRefDotFromVertices(verts),
            color: dragContext.color ? dragContext.color.replace('0.5', '0.25') : 'rgba(100,100,255,0.25)',
            label: `${dragContext.label} (dragging)`,
        });
    };

    const handlePlotClickToFinalizeMove = () => {
        if (!dragContext || !previewObjectState) return;
        const objectToUpdate = objects.find(o => o.id === dragContext.objectId);
        if (!objectToUpdate) { clearInteractions(); return; }

        const finalObjectState = {
            ...objectToUpdate,
            scene_x: previewObjectState.scene_x,
            scene_y: previewObjectState.scene_y,
            orientation: dragContext.orientation,
        };
        const finalUpdatedObj = handleObjectUpdate(finalObjectState);

        recordAction({
            type: 'MOVE_OBJECT_TO',
            objectId: dragContext.objectId,
            new_pos: [finalUpdatedObj.scene_x, finalUpdatedObj.scene_y],
            new_orientation: finalUpdatedObj.orientation,
        });
        setDragContext(null); 
        initiateImplicitRotation(finalUpdatedObj.id);
    };

    const initiateExplicitRotation = () => {
        if (!primarySelectedObjectId) { alert("Please select an object to rotate first."); return; }
        if (dragContext || rotationContext) { return; }
        initiateImplicitRotation(primarySelectedObjectId);
    };
    
    const handlePlotMouseMoveForRotation = (mousePlotXData_sceneY, mousePlotYData_sceneX) => {
        if (!rotationContext) return;
        const { objectId, scene_x, scene_y, size_sx, size_sy, color, label } = rotationContext;

        const delta_scene_x_comp = mousePlotYData_sceneX - scene_x;
        const delta_scene_y_comp = mousePlotXData_sceneY - scene_y;
        const newOrientationRadians = Math.atan2(delta_scene_x_comp, delta_scene_y_comp);
        let newOrientationDegrees = toDegrees(newOrientationRadians);
        
        const verts = calculateVertices(scene_x, scene_y, size_sx, size_sy, newOrientationDegrees);
        setPreviewObjectState({
            id: `${objectId}-preview-rotate`,
            scene_x: scene_x, scene_y: scene_y,
            size_sx: size_sx, size_sy: size_sy,
            orientation: newOrientationDegrees,
            verts: verts,
            ref_dot: calculateRefDotFromVertices(verts),
            color: color ? color.replace('0.5', '0.2') : 'rgba(120,120,255,0.2)',
            label: `${label} (rotating ${newOrientationDegrees.toFixed(0)}°)`,
        });
    };

    const handlePlotClickToFinalizeRotation = () => {
        if (!rotationContext || !previewObjectState) return;
        const objectToUpdate = objects.find(o => o.id === rotationContext.objectId);
        if (!objectToUpdate) { clearInteractions(); return; }

        const finalObjectState = {
            ...objectToUpdate,
            orientation: previewObjectState.orientation,
        };
        const finalUpdatedObj = handleObjectUpdate(finalObjectState);
        recordAction({
            type: 'ROTATE_OBJECT',
            objectId: rotationContext.objectId,
            original_orientation: rotationContext.originalOrientationDegrees,
            new_orientation: finalUpdatedObj.orientation,
        });
        clearInteractions();
    };
    
    const handlePreviousScene = () => {
        const parsed = parseTaskId(currentTaskId);
        if (!parsed) { console.error("Cannot navigate: currentTaskId is invalid or unparseable.", currentTaskId); return; }
        let { main, sub } = parsed;
        if (main === MIN_MAIN_ID && sub === MIN_SUB_ID) { return; }
        if (sub > MIN_SUB_ID) { sub--; } 
        else { sub = MAX_SUB_ID; main--; if (main < MIN_MAIN_ID) { main = MIN_MAIN_ID; sub = MIN_SUB_ID;}}
        const newTaskId = formatTaskId(main, sub);
        setCurrentTaskId(newTaskId);
    };

    const handleNextScene = () => {
        const parsed = parseTaskId(currentTaskId);
        if (!parsed) { console.error("Cannot navigate: currentTaskId is invalid or unparseable.", currentTaskId); return; }
        let { main, sub } = parsed;
        if (main === MAX_MAIN_ID && sub === MAX_SUB_ID) { return; }
        if (sub < MAX_SUB_ID) { sub++;} 
        else { sub = MIN_SUB_ID; main++; if (main > MAX_MAIN_ID) { main = MAX_MAIN_ID; sub = MAX_SUB_ID;}}
        const newTaskId = formatTaskId(main, sub);
        setCurrentTaskId(newTaskId);
    };

    const isAtFirstScene = () => {
        const parsed = parseTaskId(currentTaskId);
        return parsed ? (parsed.main === MIN_MAIN_ID && parsed.sub === MIN_SUB_ID) : true;
    };

    const isAtLastScene = () => {
        const parsed = parseTaskId(currentTaskId);
        return parsed ? (parsed.main === MAX_MAIN_ID && parsed.sub === MAX_SUB_ID) : true;
    };

    const getObjectDisplayLabel = (objectId) => {
        if (!objectId) return 'None';
        const selectedObject = objects.find(obj => obj.id === objectId);
        return selectedObject ? (selectedObject.label || selectedObject.name || `ID: ${selectedObject.id}`) : `ID: ${objectId} (Not found)`;
    };

    let currentPreviewObjectForPlotter = null;
    if ((dragContext || rotationContext) && previewObjectState) {
        currentPreviewObjectForPlotter = previewObjectState;
    }

    return (
        <div className="App">
            <h1>Bounding Box Manipulator</h1>
            <div className="scene-navigation-controls">
                <button onClick={handlePreviousScene} disabled={isAtFirstScene()} className="control-button nav-button"> &lt; Prev </button>
                <SceneSelector currentTaskId={currentTaskId} onSetCurrentTaskId={setCurrentTaskId} />
                <button onClick={handleNextScene} disabled={isAtLastScene()} className="control-button nav-button"> Next &gt; </button>
            </div>

            {error && <p className="error">{error}</p>}

            {sceneData && (
                <div>
                    <h2>Scene: {sceneData.taskId || currentTaskId}</h2>
                    <div className="app-layout">
                        <div className="main-visuals-stack">
                             <div className="original-image-container">
                                {sceneData.originalImageSrc ? ( 
                                    <img 
                                        src={`http://localhost:3001${sceneData.originalImageSrc}`} 
                                        alt={`Original Scene ${sceneData.taskId || currentTaskId}`} 
                                        style={{
                                            maxWidth: '100%', 
                                            maxHeight: `${MANUAL_PLOT_CONFIG.plot_target_height}px`, 
                                            height: 'auto', 
                                            border: '1px solid #ccc', 
                                            objectFit: 'contain', 
                                            display: 'block', 
                                            margin: '0 auto' 
                                        }} 
                                    />
                                ) : (
                                    <div className="placeholder-box" style={{width: `${MANUAL_PLOT_CONFIG.plot_target_width}px`, height: '400px'}}> 
                                        Original Image Area (Not Available)
                                    </div>
                                )}
                            </div>
                            <div className="js-plot-container">
                                <CombinedPlotterSceneViewer
                                    objects={objects}
                                    plotMetadata={MANUAL_PLOT_CONFIG} 
                                    tableLimitsData={TABLE_LIMITS} // Pass TABLE_LIMITS directly
                                    selectedObjectIds={{ primary: primarySelectedObjectId, reference: referenceSelectedObjectId }}
                                    onObjectClick={handleObjectClickForSelection}
                                    isDraggingActive={!!dragContext}
                                    isRotatingActive={!!rotationContext}
                                    onPlotMouseMove={dragContext ? handlePlotMouseMoveForDrag : (rotationContext ? handlePlotMouseMoveForRotation : null)}
                                    onPlotClick={dragContext ? handlePlotClickToFinalizeMove : (rotationContext ? handlePlotClickToFinalizeRotation : null)}
                                    previewObject={currentPreviewObjectForPlotter}
                                />
                            </div>
                        </div>
                        <div className="controls-panel-container">
                             <div className="controls-panel">
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

                                { (primarySelectedObjectId || dragContext || rotationContext) && <h4>Available Operations:</h4> }
                                <div className="actions-main-container">
                                    {primarySelectedObjectId && referenceSelectedObjectId && !dragContext && !rotationContext && (
                                        <div className="operation-section categorical-ops">
                                            <h5>Categorical Actions:</h5>
                                            <p className="instruction-small">Primary = object to act. Reference = target.</p>
                                            <button className="control-button action-button" onClick={() => handleCategoricalAction('OPEN_LID')}>Open Lid</button>
                                            <button className="control-button action-button" onClick={() => handleCategoricalAction('CLOSE_LID')}>Close Lid</button>
                                            <button className="control-button action-button" onClick={() => handleCategoricalAction('IN_BASKET')}>Put In Basket</button>
                                            <button className="control-button action-button" onClick={() => handleCategoricalAction('ON_SUPPORT')}>Place On Support</button>
                                        </div>
                                    )}
                                    {primarySelectedObjectId && referenceSelectedObjectId && !dragContext && !rotationContext && (
                                        <div className="operation-section translational-ops-setup">
                                            <h5>Translational Movement (Primary Object):</h5>
                                            <p className="instruction-small">Select direction to move Primary along Reference's axis.</p>
                                            <div className="direction-controls">
                                                <button onClick={() => initiateTranslationalDrag('UP')} className="control-button direction-button">Up</button>
                                                <button onClick={() => initiateTranslationalDrag('DOWN')} className="control-button direction-button">Down</button>
                                                <button onClick={() => initiateTranslationalDrag('LEFT')} className="control-button direction-button">Left</button>
                                                <button onClick={() => initiateTranslationalDrag('RIGHT')} className="control-button direction-button">Right</button>
                                            </div>
                                        </div>
                                    )}
                                    {dragContext && (
                                         <div className="operation-section translational-ops-active">
                                            <h5>Translational Movement (Active):</h5>
                                            <p className="instruction-small drag-active-text">Drag '{dragContext.label}' along axis. Click plot to place.</p>
                                            <button onClick={() => { clearInteractions(); }} className="control-button cancel-drag-button">Cancel Move</button>
                                        </div>
                                    )}

                                    {primarySelectedObjectId && !dragContext && (
                                        <div className="operation-section rotational-ops">
                                            <h5>Rotational Movement</h5>
                                            {rotationContext ? (
                                                <>
                                                    <p className="instruction-small drag-active-text">Move mouse to rotate '{rotationContext.label}'. Click plot to finalize.</p>
                                                    <button onClick={() => { clearInteractions(); }} className="control-button cancel-drag-button">Cancel Rotate</button>
                                                </>
                                            ) : (
                                                <button onClick={initiateExplicitRotation} className="control-button action-button">Rotate Selected Explicitly</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                 {(primarySelectedObjectId || dragContext || rotationContext) && <hr className="controls-separator" /> }
                                
                                {!dragContext && !rotationContext && !primarySelectedObjectId && (
                                    <p className="instruction">1. Select a primary object from the plot.</p>
                                )}
                                {!dragContext && !rotationContext && primarySelectedObjectId && !referenceSelectedObjectId && (
                                    <p className="instruction">2. Select a reference object (for Translate/Categorical ops) OR click 'Rotate Selected Explicitly'. (Rotation will also auto-activate after moves/placements).</p>
                                )}
                                {!dragContext && !rotationContext && primarySelectedObjectId && referenceSelectedObjectId && (
                                     <p className="instruction">3. Choose a Translational or Categorical operation above.</p>
                                )}
                                {rotationContext && (
                                    <p className="instruction">Rotate the object by moving the mouse. Click on the plot to finalize the orientation.</p>
                                )}
                                {dragContext && (
                                    <p className="instruction">Drag the object to the desired position. Click on the plot to finalize the move.</p>
                                )}
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
