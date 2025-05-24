import React, { useState, useEffect, useMemo, useRef } from 'react';
import BoundingBox from './BoundingBox'; // Assuming BoundingBox.js is in the same directory or accessible

const AXIS_PADDING = 50;
const TICK_LENGTH = 5;
const NUM_TICKS = 5;

const FIXED_SCENE_Y_DATA_MIN = -0.6;
const FIXED_SCENE_Y_DATA_MAX = 0.2;
const FIXED_SCENE_X_DATA_MIN = 0.0;
const FIXED_SCENE_X_DATA_MAX = 0.5;

function CombinedPlotterSceneViewer({
    sceneImage, // From SceneViewer
    objects, // Common prop
    plotMetadata, // Common prop (though structure might differ, may need merging/checking)
    selectedObjectIds, // From JSPlotter (structure might be {primary, reference})
    onObjectClick, // Common prop
    isDraggingActive, // From JSPlotter
    isRotatingActive, // From JSPlotter
    onPlotMouseMove, // From JSPlotter
    onPlotClick, // From JSPlotter
    previewObject, // From JSPlotter
    // Note: selectedObjectIds in SceneViewer was an array, in JSPlotter it's an object.
    // We'll assume the JSPlotter's structure for selectedObjectIds for now, or it needs to be reconciled.
}) {
    // --- State and Refs ---
    const [currentDataForPlotXaxis, setCurrentDataForPlotXaxis] = useState(null);
    const [currentDataForPlotYaxis, setCurrentDataForPlotYaxis] = useState(null);
    const svgRef = useRef(null); // For JSPlotter part
    const containerRef = useRef(null); // For SceneViewer part
    const [imageLoaded, setImageLoaded] = useState(false); // For SceneViewer part

    // --- Memos ---
    // From JSPlotter: Calculates pixel dimensions of the plot area
    const { plotAreaPixelWidth, plotAreaPixelHeight } = useMemo(() => {
        const width = plotMetadata?.plot_target_width; // Used by JSPlotter for its own SVG
        const height = plotMetadata?.plot_target_height; // Used by JSPlotter for its own SVG
        const calculatedWidth = width - 2 * AXIS_PADDING;
        const calculatedHeight =  height - 2 * AXIS_PADDING;
        // Log the calculated plot area dimensions
        console.log('[CombinedPlotterSceneViewer] Calculated plotAreaPixelWidth:', calculatedWidth);
        console.log('[CombinedPlotterSceneViewer] Calculated plotAreaPixelHeight:', calculatedHeight);
        return {
            plotAreaPixelWidth: calculatedWidth,
            plotAreaPixelHeight: calculatedHeight,
        };
    }, [plotMetadata?.plot_target_width, plotMetadata?.plot_target_height]);



    // From JSPlotter: Calculate data range for axes based on plotMetadata and aspect ratio
    useEffect(() => {

        let targetMinPlotXData = plotMetadata.xlim_plot?.min ?? FIXED_SCENE_Y_DATA_MIN;
        let targetMaxPlotXData = plotMetadata.xlim_plot?.max ?? FIXED_SCENE_Y_DATA_MAX;
        let targetMinPlotYData = plotMetadata.ylim_plot?.min ?? FIXED_SCENE_X_DATA_MIN;
        let targetMaxPlotYData = plotMetadata.ylim_plot?.max ?? FIXED_SCENE_X_DATA_MAX;


        let dataRangeHorizontal = targetMaxPlotXData - targetMinPlotXData;
        let dataRangeVertical = targetMaxPlotYData - targetMinPlotYData;

        console.log('[CombinedPlotterSceneViewer] Calculated dataRangeHorizontal:', dataRangeHorizontal);
        console.log('[CombinedPlotterSceneViewer] Calculated dataRangeVertical:', dataRangeVertical);

        const pixelAspectRatio = plotAreaPixelWidth / plotAreaPixelHeight;
        const dataAspectRatio = dataRangeHorizontal / dataRangeVertical;

        console.log('[CombinedPlotterSceneViewer] Calculated pixelAspectRatio:', pixelAspectRatio);
        console.log('[CombinedPlotterSceneViewer] Calculated dataAspectRatio:', dataAspectRatio);
        if (Math.abs(pixelAspectRatio - dataAspectRatio) > 1e-6) {
            if (dataAspectRatio > pixelAspectRatio) {
                const newDataRangeVertical = dataRangeHorizontal / pixelAspectRatio;
                const sceneX_center = (targetMinPlotYData + targetMaxPlotYData) / 2;
                targetMinPlotYData = sceneX_center - newDataRangeVertical / 2;
                targetMaxPlotYData = sceneX_center + newDataRangeVertical / 2;
            } else {
                const newDataRangeHorizontal = dataRangeVertical * pixelAspectRatio;
                const sceneY_center = (targetMinPlotXData + targetMaxPlotXData) / 2;
                targetMinPlotXData = sceneY_center - newDataRangeHorizontal / 2;
                targetMaxPlotXData = sceneY_center + newDataRangeHorizontal / 2;
            }
        }
        
        setCurrentDataForPlotXaxis([targetMinPlotXData, targetMaxPlotXData]);
        setCurrentDataForPlotYaxis([targetMinPlotYData, targetMaxPlotYData]);
    }, [plotMetadata, plotAreaPixelWidth, plotAreaPixelHeight, sceneImage]);

    // --- Transformations ---
    // From JSPlotter: Transforms data coordinates to pixel coordinates for the standalone plot
    const plotAreaXStart = AXIS_PADDING;
    const plotAreaYStart = AXIS_PADDING;

    const transformDataToPixelJSPlotter = (data_scene_y, data_scene_x) => {
        if (!currentDataForPlotXaxis || !currentDataForPlotYaxis || plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0) {
            return { x: plotAreaXStart, y: plotAreaYStart };
        }
        const [px_data_min, px_data_max] = currentDataForPlotXaxis;
        const [py_data_min, py_data_max] = currentDataForPlotYaxis;

        const px_range_data = px_data_max - px_data_min;
        const py_range_data = py_data_max - py_data_min;

        let svg_x_ratio = 0.5; if (px_range_data > 1e-9) svg_x_ratio = (data_scene_y - px_data_min) / px_range_data;
        let svg_y_ratio = 0.5; if (py_range_data > 1e-9) svg_y_ratio = (data_scene_x - py_data_min) / py_range_data;

        return {
            x: plotAreaXStart + svg_x_ratio * plotAreaPixelWidth,
            y: plotAreaYStart + svg_y_ratio * plotAreaPixelHeight
        };
    };

    // From JSPlotter: Transforms pixel coordinates to data coordinates for the standalone plot
    const transformPixelToDataJSPlotter = (svgX, svgY) => {
        if (!currentDataForPlotXaxis || !currentDataForPlotYaxis || plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0) {
            return { data_scene_y: (FIXED_SCENE_Y_DATA_MIN + FIXED_SCENE_Y_DATA_MAX) / 2, data_scene_x: (FIXED_SCENE_X_DATA_MIN + FIXED_SCENE_X_DATA_MAX) / 2 };
        }
        const [px_data_min, px_data_max] = currentDataForPlotXaxis;
        const [py_data_min, py_data_max] = currentDataForPlotYaxis;

        const px_range_data = px_data_max - px_data_min;
        const py_range_data = py_data_max - py_data_min;

        const svg_x_ratio = plotAreaPixelWidth === 0 ? 0.5 : Math.max(0, Math.min(1, (svgX - plotAreaXStart) / plotAreaPixelWidth));
        const svg_y_ratio = plotAreaPixelHeight === 0 ? 0.5 : Math.max(0, Math.min(1, (svgY - plotAreaYStart) / plotAreaPixelHeight));

        const data_scene_y = px_data_min + svg_x_ratio * px_range_data;
        const data_scene_x = py_data_min + svg_y_ratio * py_range_data;
        return { data_scene_y, data_scene_x };
    };


    // --- Event Handlers ---
    const handleMouseMove = (event) => { // For JSPlotter interactions
        if ((isDraggingActive || isRotatingActive) && onPlotMouseMove && svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const svgX = event.clientX - svgRect.left;
            const svgY = event.clientY - svgRect.top;
            // Use JSPlotter's transformation if interacting with the standalone plot
            const { data_scene_y, data_scene_x } = transformPixelToDataJSPlotter(svgX, svgY);
            onPlotMouseMove(data_scene_y, data_scene_x);
        }
    };

    const handleClick = (event) => { // For JSPlotter interactions
        if ((isDraggingActive || isRotatingActive) && onPlotClick) {
            onPlotClick(); // This likely signals the end of a drag/rotate action
        }
        // Note: SceneViewer doesn't have a generic SVG click, only on BoundingBox components
    };
    
    const handleImageLoad = () => {
        setImageLoaded(true);
    };


    // --- Render Helpers (from JSPlotter) ---
    const renderGrid = () => {
        const elements = [];
        if (plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0 || !currentDataForPlotXaxis || !currentDataForPlotYaxis) {
            return elements;
        }
        for (let i = 1; i < NUM_TICKS; i++) {
            const tickScreenX = plotAreaXStart + (i / NUM_TICKS) * plotAreaPixelWidth;
            elements.push( <line key={`grid-vert-${i}`} x1={tickScreenX} y1={plotAreaYStart} x2={tickScreenX} y2={plotAreaYStart + plotAreaPixelHeight} stroke="black" strokeWidth="0.5" strokeDasharray="2,2" /> );
        }
        for (let i = 1; i < NUM_TICKS; i++) {
            const tickScreenY = plotAreaYStart + (i / NUM_TICKS) * plotAreaPixelHeight;
            elements.push( <line key={`grid-horiz-${i}`} x1={plotAreaXStart} y1={tickScreenY} x2={plotAreaXStart + plotAreaPixelWidth} y2={tickScreenY} stroke="black" strokeWidth="0.5" strokeDasharray="2,2" /> );
        }
        return elements;
    };

    const renderAxesAndTicks = () => {
        const elements = [];
        if (plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0 || !currentDataForPlotXaxis || !currentDataForPlotYaxis) return elements;
        const xAxisY = plotAreaYStart + plotAreaPixelHeight;
        elements.push(<line key="plot-x-axis" x1={plotAreaXStart} y1={xAxisY} x2={plotAreaXStart + plotAreaPixelWidth} y2={xAxisY} stroke="#555" strokeWidth="1"/>);
        elements.push(<text key="plot-x-label" x={plotAreaXStart + plotAreaPixelWidth / 2} y={xAxisY + AXIS_PADDING / 1.8} textAnchor="middle" fontSize="11px" fill="#333">scene_y (right +)</text>);
        const yAxisX = plotAreaXStart;
        elements.push(<line key="plot-y-axis" x1={yAxisX} y1={plotAreaYStart} x2={yAxisX} y2={plotAreaYStart + plotAreaPixelHeight} stroke="#555" strokeWidth="1"/>);
        elements.push( <text key="plot-y-label" x={yAxisX - AXIS_PADDING / 1.8} y={plotAreaYStart + plotAreaPixelHeight / 2} textAnchor="middle" fontSize="11px" fill="#333" transform={`rotate(-90, ${yAxisX - AXIS_PADDING / 1.8}, ${plotAreaYStart + plotAreaPixelHeight / 2})`}> scene_x (down +) </text> );
        
        const [y_scene_min_tick, y_scene_max_tick] = currentDataForPlotXaxis;
        const y_scene_tick_range = y_scene_max_tick - y_scene_min_tick;
        if (y_scene_tick_range > 1e-9) { 
            for (let i = 0; i <= NUM_TICKS; i++) { 
                const dataVal = y_scene_min_tick + (i / NUM_TICKS) * y_scene_tick_range; 
                const tickScreenX = plotAreaXStart + (i / NUM_TICKS) * plotAreaPixelWidth; 
                elements.push(<line key={`plot-xtick-${i}`} x1={tickScreenX} y1={xAxisY} x2={tickScreenX} y2={xAxisY + TICK_LENGTH} stroke="#555" />); 
                elements.push(<text key={`plot-xlabel-${i}`} x={tickScreenX} y={xAxisY + TICK_LENGTH + 12} textAnchor="middle" fontSize="9px" fill="#444">{dataVal.toFixed(1)}</text>); 
            }
        }
        
        const [x_scene_min_tick_range, x_scene_max_tick_range] = currentDataForPlotYaxis;
        const x_scene_tick_span_on_plot = x_scene_max_tick_range - x_scene_min_tick_range;
        if (Math.abs(x_scene_tick_span_on_plot) > 1e-6) { 
            for (let i = 0; i <= NUM_TICKS; i++) { 
                const dataVal = x_scene_min_tick_range + (i / NUM_TICKS) * x_scene_tick_span_on_plot; 
                const tickScreenY = plotAreaYStart + (i / NUM_TICKS) * plotAreaPixelHeight;
                elements.push(<line key={`plot-ytick-${i}`} x1={yAxisX} y1={tickScreenY} x2={yAxisX - TICK_LENGTH} y2={tickScreenY} stroke="#555" />); 
                elements.push(<text key={`plot-ylabel-${i}`} x={yAxisX - TICK_LENGTH - 4} y={tickScreenY + 3} textAnchor="end" fontSize="9px" fill="#444">{dataVal.toFixed(1)}</text>); 
            }
        }
        return elements;
    };
    
    const renderTableLimitsJSPlotter = () => {
        if (!currentDataForPlotXaxis || !currentDataForPlotYaxis || !plotMetadata?.tableLimits) { return null; }
        const { tableLimits } = plotMetadata; 
        const topLeft = transformDataToPixelJSPlotter(tableLimits.sceneY_min, tableLimits.sceneX_min);
        const bottomRight = transformDataToPixelJSPlotter(tableLimits.sceneY_max, tableLimits.sceneX_max);
        const rectWidth = Math.max(0, bottomRight.x - topLeft.x);
        const rectHeight = Math.max(0, bottomRight.y - topLeft.y);
        if (rectWidth <= 0 || rectHeight <=0) return null;
        return ( <rect x={topLeft.x} y={topLeft.y} width={rectWidth} height={rectHeight} fill="none" stroke="rgba(0, 128, 0, 0.3)" strokeWidth="1" strokeDasharray="4,4" /> );
    };


    // --- Main Render ---
        const cursorStyle = isDraggingActive ? 'move' : (isRotatingActive ? 'crosshair' : 'default');
        const isInteracting = isDraggingActive || isRotatingActive;

        return (
            <svg
                ref={svgRef}
                width={plotMetadata.plot_target_width}
                height={plotMetadata.plot_target_height}
                style={{ border: '1px solid #ccc', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif', overflow: 'visible', cursor: cursorStyle }}
                onMouseMove={isInteracting ? handleMouseMove : undefined}
                onClick={handleClick} // JSPlotter's general click for drag/rotate end
            >
                {renderGrid()}
                {renderAxesAndTicks()}
                {plotMetadata?.tableLimits && renderTableLimitsJSPlotter()}

                {objects && objects.map(obj => {
                    if (isInteracting && previewObject && (previewObject.id.startsWith(obj.id))) {
                        return null;
                    }
                    if (!obj.verts || obj.verts.length < 3) return null;
                    const pointsStr = obj.verts.map(v => { const transformed = transformDataToPixelJSPlotter(v[0], v[1]); return `${transformed.x.toFixed(1)},${transformed.y.toFixed(1)}`; }).join(' ');
                    
                    let labelCenterX = 0, labelCenterY = 0;
                    if (obj.verts.length > 0) {
                        let sumX = 0, sumY = 0;
                        let validTP = 0;
                        obj.verts.forEach(v_1 => {
                            const tp = transformDataToPixelJSPlotter(v_1[0], v_1[1]);
                            if(!isNaN(tp.x) && !isNaN(tp.y)){ sumX += tp.x; sumY += tp.y; validTP++;}
                        });
                        if (validTP > 0) { labelCenterX = sumX / validTP; labelCenterY = sumY / validTP;}
                    }

                    let highlight = 'none';
                    if (selectedObjectIds?.primary === obj.id) highlight = 'blue';
                    else if (selectedObjectIds?.reference === obj.id) highlight = 'green';
                    
                    const refDotPixel = obj.ref_dot ? transformDataToPixelJSPlotter(obj.ref_dot[0], obj.ref_dot[1]) : null;

                    return ( <BoundingBox key={obj.id} id={obj.id} points={pointsStr} label={obj.label || obj.name} color={obj.color} isSelected={selectedObjectIds?.primary === obj.id || selectedObjectIds?.reference === obj.id} highlightColor={highlight} onClick={(e) => { if (!isInteracting && onObjectClick) { e.stopPropagation(); onObjectClick(obj.id); }}} textX={labelCenterX} textY={labelCenterY} refDotX={refDotPixel?.x} refDotY={refDotPixel?.y} /> );
                })}
                {isInteracting && previewObject && previewObject.verts && (
                     (() => {
                        const pointsStr = previewObject.verts.map(v_2 => { const transformed = transformDataToPixelJSPlotter(v_2[0], v_2[1]); return `${transformed.x.toFixed(1)},${transformed.y.toFixed(1)}`; }).join(' ');
                        const labelCenterX = previewObject.verts.reduce((acc, v_3, _, arr) => acc + transformDataToPixelJSPlotter(v_3[0], v_3[1]).x / arr.length, 0);
                        const labelCenterY = previewObject.verts.reduce((acc, v_3, _, arr) => acc + transformDataToPixelJSPlotter(v_3[0], v_3[1]).y / arr.length, 0);
                        const refDotPixel = previewObject.ref_dot ? transformDataToPixelJSPlotter(previewObject.ref_dot[0], previewObject.ref_dot[1]) : null;
                        return ( <BoundingBox id={previewObject.id} points={pointsStr} label={previewObject.label} color={previewObject.color} isSelected={true} highlightColor={isRotatingActive ? "magenta" : "purple"} onClick={() => {}} textX={labelCenterX} textY={labelCenterY} refDotX={refDotPixel?.x} refDotY={refDotPixel?.y} /> );
                     })()
                )}
            </svg>
        );
    
}

export default CombinedPlotterSceneViewer;