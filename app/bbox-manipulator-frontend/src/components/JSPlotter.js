import React, { useState, useEffect, useMemo, useRef } from 'react';
import BoundingBox from './BoundingBox';

const AXIS_PADDING = 50;
const TICK_LENGTH = 5;
const NUM_TICKS = 5;

// Define your desired fixed data ranges based on your scene coordinates
// Plot's X-axis (horizontal) will display Scene Y data
const FIXED_SCENE_Y_DATA_MIN = -0.6;
const FIXED_SCENE_Y_DATA_MAX = 0.2;

// Plot's Y-axis (vertical) will display Scene X data
const FIXED_SCENE_X_DATA_MIN = 0.0;
const FIXED_SCENE_X_DATA_MAX = 0.5;


function JSPlotter({
    objects,
    plotMetadata, // Expects: plot_target_width, plot_target_height, tableLimits
    selectedObjectIds,
    onObjectClick,
    isDraggingActive,
    onPlotMouseMove,
    onPlotClick,
    previewObject
}) {
    const [currentDataForPlotXaxis, setCurrentDataForPlotXaxis] = useState(null); // For scene Y
    const [currentDataForPlotYaxis, setCurrentDataForPlotYaxis] = useState(null); // For scene X
    
    const svgRef = useRef(null);

    const { plotAreaPixelWidth, plotAreaPixelHeight } = useMemo(() => {
        if (!plotMetadata || typeof plotMetadata.plot_target_width !== 'number' || typeof plotMetadata.plot_target_height !== 'number') {
            console.warn("JSPlotter (useMemo): plot_target_width/height missing or invalid. Using fallback.", plotMetadata);
            return { plotAreaPixelWidth: Math.max(1, 600 - 2 * AXIS_PADDING), plotAreaPixelHeight: Math.max(1, 600 - 2 * AXIS_PADDING) };
        }
        const { plot_target_width, plot_target_height } = plotMetadata;
        const calculatedWidth = Math.max(1, plot_target_width - 2 * AXIS_PADDING);
        const calculatedHeight = Math.max(1, plot_target_height - 2 * AXIS_PADDING);
        return {
            plotAreaPixelWidth: calculatedWidth,
            plotAreaPixelHeight: calculatedHeight,
        };
    }, [plotMetadata]);

    useEffect(() => {
        console.log("JSPlotter: useEffect for data limits triggered. plotMetadata:", plotMetadata);
        if (!plotMetadata || 
            typeof plotMetadata.plot_target_width !== 'number' ||
            typeof plotMetadata.plot_target_height !== 'number' ||
            plotAreaPixelWidth <= 0 || 
            plotAreaPixelHeight <= 0 ) {
            console.warn("JSPlotter (useEffect): Essential metadata or valid pixel area missing. Using broad default ranges.");
            // const defaultRange = [-0.5, 0.5]; // A simple, broad default
            // setCurrentDataForPlotXaxis(defaultRange);
            // setCurrentDataForPlotYaxis(defaultRange);
            return;
        }

        let targetMinPlotXData = FIXED_SCENE_Y_DATA_MIN;
        let targetMaxPlotXData = FIXED_SCENE_Y_DATA_MAX;
        let targetMinPlotYData = FIXED_SCENE_X_DATA_MIN;
        let targetMaxPlotYData = FIXED_SCENE_X_DATA_MAX;

        let dataRangeHorizontal = targetMaxPlotXData - targetMinPlotXData;
        let dataRangeVertical = targetMaxPlotYData - targetMinPlotYData;

        if (dataRangeHorizontal <= 1e-9) {
            const centerX = (targetMinPlotXData + targetMaxPlotXData) / 2;
            targetMinPlotXData = centerX;
            targetMaxPlotXData = centerX;
            dataRangeHorizontal = targetMaxPlotXData - targetMinPlotXData;
        }
        if (dataRangeVertical <= 1e-9) {
            const centerY = (targetMinPlotYData + targetMaxPlotYData) / 2;
            targetMinPlotYData = centerY;
            targetMaxPlotYData = centerY;
            dataRangeVertical = targetMaxPlotYData - targetMinPlotYData;
        }
        
        console.log("JSPlotter (useEffect): Initial ranges before aspect: X-Plot(SceneY):", [targetMinPlotXData, targetMaxPlotXData], "Y-Plot(SceneX):", [targetMinPlotYData, targetMaxPlotYData]);
        console.log("JSPlotter (useEffect): Pixel Area W/H:", plotAreaPixelWidth, plotAreaPixelHeight);

        if (plotAreaPixelWidth > 0 && plotAreaPixelHeight > 0 && dataRangeHorizontal > 0 && dataRangeVertical > 0) {
            const pixelAspectRatio = plotAreaPixelWidth / plotAreaPixelHeight;
            const dataAspectRatio = dataRangeHorizontal / dataRangeVertical;
            console.log("JSPlotter (useEffect): PixelAR:", pixelAspectRatio, "DataAR:", dataAspectRatio);

            if (Math.abs(pixelAspectRatio - dataAspectRatio) > 1e-6) {
                if (dataAspectRatio > pixelAspectRatio) {
                    const newDataRangeVertical = dataRangeHorizontal / pixelAspectRatio;
                    const sceneX_center = (targetMinPlotYData + targetMaxPlotYData) / 2;
                    targetMinPlotYData = sceneX_center - newDataRangeVertical / 2;
                    targetMaxPlotYData = sceneX_center + newDataRangeVertical / 2;
                    const newDataRangeHorizontal = dataRangeVertical * pixelAspectRatio;
                    const sceneY_center = (targetMinPlotXData + targetMaxPlotXData) / 2;
                    targetMinPlotXData = sceneY_center - newDataRangeHorizontal / 2;
                    targetMaxPlotXData = sceneY_center + newDataRangeHorizontal / 2;
                }
            }
        }

        setCurrentDataForPlotXaxis([targetMinPlotXData, targetMaxPlotXData]);
        setCurrentDataForPlotYaxis([targetMinPlotYData, targetMaxPlotYData]);
        console.log("JSPlotter (useEffect): Final Data Ranges Set - PlotX (SceneY):", [targetMinPlotXData, targetMaxPlotXData], "PlotY (SceneX):", [targetMinPlotYData, targetMaxPlotYData]);

    }, [plotMetadata, plotAreaPixelWidth, plotAreaPixelHeight]);


    const plotAreaXStart = AXIS_PADDING;
    const plotAreaYStart = AXIS_PADDING;

    const transformDataToPixel = (data_scene_y, data_scene_x) => {
        if (!currentDataForPlotXaxis || !currentDataForPlotYaxis || plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0) {
            return { x: plotAreaXStart, y: plotAreaYStart };
        }
        const [px_data_min, px_data_max] = currentDataForPlotXaxis;
        const [py_data_min, py_data_max] = currentDataForPlotYaxis;
        const px_range_data = px_data_max - px_data_min;
        const py_range_data = py_data_max - py_data_min;
        let svg_x_ratio = 0.5; if (px_range_data > 1e-9) svg_x_ratio = (data_scene_y - px_data_min) / px_range_data;
        let svg_y_ratio = 0.5; if (py_range_data > 1e-9) svg_y_ratio = (data_scene_x - py_data_min) / py_range_data;
        return { x: plotAreaXStart + svg_x_ratio * plotAreaPixelWidth, y: plotAreaYStart + svg_y_ratio * plotAreaPixelHeight };
    };

    const transformPixelToData = (svgX, svgY) => {
        if (!currentDataForPlotXaxis || !currentDataForPlotYaxis || plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0) {
            return { data_scene_y: (FIXED_SCENE_Y_DATA_MIN + FIXED_SCENE_Y_DATA_MAX)/2, data_scene_x: (FIXED_SCENE_X_DATA_MIN + FIXED_SCENE_X_DATA_MAX)/2 };
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

    const handleMouseMove = (event) => {
        if (!isDraggingActive || !onPlotMouseMove || !svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const svgX = event.clientX - svgRect.left;
        const svgY = event.clientY - svgRect.top;
        const { data_scene_y, data_scene_x } = transformPixelToData(svgX, svgY);
        onPlotMouseMove(data_scene_y, data_scene_x);
    };

    const handleClick = (event) => {
        if (isDraggingActive && onPlotClick) {
            onPlotClick();
        }
    };

    const renderAxesAndTicks = () => {
        const elements = [];
        console.log("renderAxesAndTicks: Called. PlotArea W/H:", plotAreaPixelWidth, plotAreaPixelHeight, "PlotXRange:", currentDataForPlotXaxis, "PlotYRange:", currentDataForPlotYaxis);
        if (plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0 || !currentDataForPlotXaxis || !currentDataForPlotYaxis) {
            console.warn("renderAxesAndTicks: GUARD HIT, returning empty.", { plotAreaPixelWidth, plotAreaPixelHeight, currentDataForPlotXaxis, currentDataForPlotYaxis });
            return elements;
        }
        const xAxisY = plotAreaYStart + plotAreaPixelHeight;
        elements.push(<line key="plot-x-axis" x1={plotAreaXStart} y1={xAxisY} x2={plotAreaXStart + plotAreaPixelWidth} y2={xAxisY} stroke="#555" strokeWidth="1"/>);
        elements.push(<text key="plot-x-label" x={plotAreaXStart + plotAreaPixelWidth / 2} y={xAxisY + AXIS_PADDING / 1.8} textAnchor="middle" fontSize="11px" fill="#333">y (right +)</text>);
        const yAxisX = plotAreaXStart;
        elements.push(<line key="plot-y-axis" x1={yAxisX} y1={plotAreaYStart} x2={yAxisX} y2={plotAreaYStart + plotAreaPixelHeight} stroke="#555" strokeWidth="1"/>);
        elements.push( <text key="plot-y-label" x={yAxisX - AXIS_PADDING / 1.8} y={plotAreaYStart + plotAreaPixelHeight / 2} textAnchor="middle" fontSize="11px" fill="#333" transform={`rotate(-90, ${yAxisX - AXIS_PADDING / 1.8}, ${plotAreaYStart + plotAreaPixelHeight / 2})`}> x (down +) </text> );
        const [y_scene_min_tick, y_scene_max_tick] = currentDataForPlotXaxis;
        const y_scene_tick_range = y_scene_max_tick - y_scene_min_tick;
        if (y_scene_tick_range > 1e-6) { for (let i = 0; i <= NUM_TICKS; i++) { const dataVal = y_scene_min_tick + (i / NUM_TICKS) * y_scene_tick_range; const tickScreenX = plotAreaXStart + (i / NUM_TICKS) * plotAreaPixelWidth; elements.push(<line key={`plot-xtick-${i}`} x1={tickScreenX} y1={xAxisY} x2={tickScreenX} y2={xAxisY + TICK_LENGTH} stroke="#555" />); elements.push(<text key={`plot-xlabel-${i}`} x={tickScreenX} y={xAxisY + TICK_LENGTH + 12} textAnchor="middle" fontSize="9px" fill="#444">{dataVal.toFixed(1)}</text>); } }
        const [x_scene_min_tick_range, x_scene_max_tick_range] = currentDataForPlotYaxis;
        const x_scene_tick_span_on_plot = x_scene_max_tick_range - x_scene_min_tick_range;
        if (Math.abs(x_scene_tick_span_on_plot) > 1e-6) { for (let i = 0; i <= NUM_TICKS; i++) { const dataVal = x_scene_min_tick_range + (i / NUM_TICKS) * x_scene_tick_span_on_plot; const tickScreenY = plotAreaYStart + (i / NUM_TICKS) * plotAreaPixelHeight; elements.push(<line key={`plot-ytick-${i}`} x1={yAxisX} y1={tickScreenY} x2={yAxisX - TICK_LENGTH} y2={tickScreenY} stroke="#555" />); elements.push(<text key={`plot-ylabel-${i}`} x={yAxisX - TICK_LENGTH - 4} y={tickScreenY + 3} textAnchor="end" fontSize="9px" fill="#444">{dataVal.toFixed(1)}</text>); } }
        if (elements.length <= 2 && (y_scene_tick_range <= 1e-6 || Math.abs(x_scene_tick_span_on_plot) <= 1e-6) ) { // Only axis lines pushed
             console.warn("renderAxesAndTicks: Only axis lines were generated. Tick ranges might be too small.", {y_scene_tick_range, x_scene_tick_span_on_plot});
        }
        return elements;
    };
    
    const renderTableLimits = () => {
        if (!currentDataForPlotXaxis || !currentDataForPlotYaxis || !plotMetadata?.tableLimits) { return null; }
        const { tableLimits } = plotMetadata; 
        const topLeft = transformDataToPixel(tableLimits.sceneY_min, tableLimits.sceneX_min);
        const bottomRight = transformDataToPixel(tableLimits.sceneY_max, tableLimits.sceneX_max);
        const rectWidth = Math.max(0, bottomRight.x - topLeft.x);
        const rectHeight = Math.max(0, bottomRight.y - topLeft.y);
        if (rectWidth <= 0 || rectHeight <=0) return null; // Don't draw if not visible
        return ( <rect x={topLeft.x} y={topLeft.y} width={rectWidth} height={rectHeight} fill="none" stroke="rgba(0, 128, 0, 0.3)" strokeWidth="1" strokeDasharray="4,4" /> );
    };

    if (!plotMetadata || typeof plotMetadata.plot_target_width !== 'number' || typeof plotMetadata.plot_target_height !== 'number') {
        return <div className="placeholder-box" style={{width: '600px', height: '600px'}}>Error: Plot target dimensions missing.</div>;
    }
    if (!currentDataForPlotXaxis || !currentDataForPlotYaxis) {
         return <div className="placeholder-box" style={{width: plotMetadata.plot_target_width, height: plotMetadata.plot_target_height}}>Calculating data limits...</div>;
    }

    return (
        <svg
            ref={svgRef}
            width={plotMetadata.plot_target_width}
            height={plotMetadata.plot_target_height}
            style={{ border: '1px solid #ccc', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif', overflow: 'visible', cursor: isDraggingActive ? 'move' : 'default' }}
            onMouseMove={isDraggingActive ? handleMouseMove : undefined}
            onClick={isDraggingActive ? handleClick : undefined}
        >
            {renderAxesAndTicks()}
            {plotMetadata?.tableLimits && renderTableLimits()}
            {objects.map(obj => {
                if (isDraggingActive && previewObject && previewObject.id.startsWith(obj.id)) { return null; }
                if (!obj.verts || obj.verts.length < 3) return null;
                const pointsStr = obj.verts.map(v => { const transformed = transformDataToPixel(v[0], v[1]); return `${transformed.x.toFixed(1)},${transformed.y.toFixed(1)}`; }).join(' ');
                let labelCenterX = 0, labelCenterY = 0;
                if (obj.verts.length > 0) { let sumX = 0, sumY = 0; let validTP = 0; obj.verts.forEach(v_1 => { const tp = transformDataToPixel(v_1[0], v_1[1]); if(!isNaN(tp.x) && !isNaN(tp.y)){ sumX += tp.x; sumY += tp.y; validTP++;}}); if (validTP > 0) { labelCenterX = sumX / validTP; labelCenterY = sumY / validTP;}}
                let highlight = 'none';
                if (selectedObjectIds?.primary === obj.id) highlight = 'blue'; else if (selectedObjectIds?.reference === obj.id) highlight = 'green';
                return ( <BoundingBox key={obj.id} id={obj.id} points={pointsStr} label={obj.label} color={obj.color} isSelected={selectedObjectIds?.primary === obj.id || selectedObjectIds?.reference === obj.id} highlightColor={highlight} onClick={(e) => { if (!isDraggingActive) { e.stopPropagation(); onObjectClick(obj.id); }}} textX={labelCenterX} textY={labelCenterY} /> );
            })}
            {isDraggingActive && previewObject && previewObject.verts && ( <BoundingBox id={previewObject.id} points={previewObject.verts.map(v_2 => { const transformed = transformDataToPixel(v_2[0], v_2[1]); return `${transformed.x.toFixed(1)},${transformed.y.toFixed(1)}`; }).join(' ')} label={previewObject.label} color={previewObject.color} isSelected={true} highlightColor="purple" onClick={() => {}} textX={previewObject.verts.reduce((acc, v_3, _, arr) => acc + transformDataToPixel(v_3[0], v_3[1]).x / arr.length, 0)} textY={previewObject.verts.reduce((acc, v_3, _, arr) => acc + transformDataToPixel(v_3[0], v_3[1]).y / arr.length, 0)} /> )}
        </svg>
    );
}
export default JSPlotter;