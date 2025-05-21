import React, { useState, useEffect, useMemo } from 'react';
import BoundingBox from './BoundingBox';

const AXIS_PADDING = 50;
const TICK_LENGTH = 5;
const NUM_TICKS = 5;
const DEFAULT_DATA_SPAN = 1.0;
const DATA_MARGIN_FACTOR = 0.1;

function JSPlotter({ objects, plotMetadata, selectedObjectIds, onObjectClick }) {
    // currentDataForPlotXaxis will store the range for the plot's HORIZONTAL axis (which displays SCENE Y data)
    const [currentDataForPlotXaxis, setCurrentDataForPlotXaxis] = useState(null);
    // currentDataForPlotYaxis will store the range for the plot's VERTICAL axis (which displays SCENE X data)
    const [currentDataForPlotYaxis, setCurrentDataForPlotYaxis] = useState(null);


    const { plotAreaPixelWidth, plotAreaPixelHeight } = useMemo(() => {
        if (!plotMetadata || typeof plotMetadata.plot_target_width !== 'number' || typeof plotMetadata.plot_target_height !== 'number') {
            return { plotAreaPixelWidth: 600 - 2 * AXIS_PADDING, plotAreaPixelHeight: 600 - 2 * AXIS_PADDING };
        }
        const { plot_target_width, plot_target_height } = plotMetadata;
        return {
            plotAreaPixelWidth: Math.max(1, plot_target_width - 2 * AXIS_PADDING),
            plotAreaPixelHeight: Math.max(1, plot_target_height - 2 * AXIS_PADDING),
        };
    }, [plotMetadata]);

    useEffect(() => {
        if (!objects) {
            setCurrentDataForPlotXaxis([-DEFAULT_DATA_SPAN / 2, DEFAULT_DATA_SPAN / 2]); // For scene Y
            setCurrentDataForPlotYaxis([-DEFAULT_DATA_SPAN / 2, DEFAULT_DATA_SPAN / 2]); // For scene X
            return;
        }

        let allSceneYValues_forPlotX = []; // Data for Plot's Horizontal X-axis
        let allSceneXValues_forPlotY = []; // Data for Plot's Vertical Y-axis

        objects.forEach(obj => {
            if (obj.verts && obj.verts.length > 0) {
                obj.verts.forEach(v => { // v is [scene_y, scene_x]
                    if (typeof v[0] === 'number' && typeof v[1] === 'number') {
                        allSceneYValues_forPlotX.push(v[0]); // scene_y for plot's X-axis
                        allSceneXValues_forPlotY.push(v[1]); // scene_x for plot's Y-axis
                    }
                });
            }
        });

        if (allSceneYValues_forPlotX.length === 0) {
            setCurrentDataForPlotXaxis([-DEFAULT_DATA_SPAN / 2, DEFAULT_DATA_SPAN / 2]);
            setCurrentDataForPlotYaxis([-DEFAULT_DATA_SPAN / 2, DEFAULT_DATA_SPAN / 2]);
            return;
        }

        let minSceneY = Math.min(...allSceneYValues_forPlotX);
        let maxSceneY = Math.max(...allSceneYValues_forPlotX);
        let minSceneX = Math.min(...allSceneXValues_forPlotY);
        let maxSceneX = Math.max(...allSceneXValues_forPlotY);

        if (maxSceneY - minSceneY < 1e-6) { minSceneY -= DEFAULT_DATA_SPAN / 2; maxSceneY += DEFAULT_DATA_SPAN / 2; }
        if (maxSceneX - minSceneX < 1e-6) { minSceneX -= DEFAULT_DATA_SPAN / 2; maxSceneX += DEFAULT_DATA_SPAN / 2; }

        const yMargin = (maxSceneY - minSceneY) * DATA_MARGIN_FACTOR || 0.1;
        const xMargin = (maxSceneX - minSceneX) * DATA_MARGIN_FACTOR || 0.1;

        let finalMinPlotXData = minSceneY - yMargin; // Data range for plot's X-axis (scene Y)
        let finalMaxPlotXData = maxSceneY + yMargin;
        let finalMinPlotYData = minSceneX - xMargin; // Data range for plot's Y-axis (scene X)
        let finalMaxPlotYData = maxSceneX + xMargin;


        let dataRangeHorizontal_PlotX = finalMaxPlotXData - finalMinPlotXData; // Span of scene Y data
        let dataRangeVertical_PlotY = finalMaxPlotYData - finalMinPlotYData;   // Span of scene X data

        if (plotAreaPixelWidth > 0 && plotAreaPixelHeight > 0 && dataRangeHorizontal_PlotX > 0 && dataRangeVertical_PlotY > 0) {
            const pixelAspectRatio = plotAreaPixelWidth / plotAreaPixelHeight;
            const dataAspectRatio = dataRangeHorizontal_PlotX / dataRangeVertical_PlotY;

            if (dataAspectRatio > pixelAspectRatio) {
                const new_dataRangeVertical_PlotY = dataRangeHorizontal_PlotX / pixelAspectRatio;
                const sceneX_center = (finalMinPlotYData + finalMaxPlotYData) / 2;
                finalMinPlotYData = sceneX_center - new_dataRangeVertical_PlotY / 2;
                finalMaxPlotYData = sceneX_center + new_dataRangeVertical_PlotY / 2;
            } else if (dataAspectRatio < pixelAspectRatio) {
                const new_dataRangeHorizontal_PlotX = dataRangeVertical_PlotY * pixelAspectRatio;
                const sceneY_center = (finalMinPlotXData + finalMaxPlotXData) / 2;
                finalMinPlotXData = sceneY_center - new_dataRangeHorizontal_PlotX / 2;
                finalMaxPlotXData = sceneY_center + new_dataRangeHorizontal_PlotX / 2;
            }
        }
        if (finalMaxPlotXData - finalMinPlotXData < 1e-6) { finalMinPlotXData -= 0.5; finalMaxPlotXData += 0.5;}
        if (finalMaxPlotYData - finalMinPlotYData < 1e-6) { finalMinPlotYData -= 0.5; finalMaxPlotYData += 0.5;}

        setCurrentDataForPlotXaxis([finalMinPlotXData, finalMaxPlotXData]);
        setCurrentDataForPlotYaxis([finalMinPlotYData, finalMaxPlotYData]); // Scene X: min at top of range, max at bottom for "down+"

    }, [objects, plotMetadata, plotAreaPixelWidth, plotAreaPixelHeight]);


    const plotAreaXStart = AXIS_PADDING;
    const plotAreaYStart = AXIS_PADDING;

    // Input: plot_x_axis_data_val (this is scene_y data), plot_y_axis_data_val (this is scene_x data)
    const transformPoint = (plot_x_axis_data_val, plot_y_axis_data_val) => {
        if (!currentDataForPlotXaxis || !currentDataForPlotYaxis || plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0) {
            return { x: plotAreaXStart, y: plotAreaYStart };
        }
        const [px_data_min, px_data_max] = currentDataForPlotXaxis; // e.g., scene Y range
        const [py_data_min, py_data_max] = currentDataForPlotYaxis; // e.g., scene X range

        const px_range_data = px_data_max - px_data_min;
        const py_range_data = py_data_max - py_data_min; // For "down+", py_data_min is top, py_data_max is bottom

        let svg_x_ratio = 0.5;
        if (px_range_data !== 0) svg_x_ratio = (plot_x_axis_data_val - px_data_min) / px_range_data;

        let svg_y_ratio = 0.5;
        if (py_range_data !== 0) svg_y_ratio = (plot_y_axis_data_val - py_data_min) / py_range_data;

        const svg_x = plotAreaXStart + svg_x_ratio * plotAreaPixelWidth;
        const svg_y = plotAreaYStart + svg_y_ratio * plotAreaPixelHeight; // SVG Y increases downwards

        return { x: svg_x, y: svg_y };
    };

    const renderAxesAndTicks = () => {
        const elements = [];
        if (plotAreaPixelWidth <= 0 || plotAreaPixelHeight <= 0 || !currentDataForPlotXaxis || !currentDataForPlotYaxis) return elements;

        // Horizontal axis (PLOT's X-axis, displays SCENE Y data)
        const plotXAxisYSVG = plotAreaYStart + plotAreaPixelHeight;
        elements.push(<line key="plot-x-axis" x1={plotAreaXStart} y1={plotXAxisYSVG} x2={plotAreaXStart + plotAreaPixelWidth} y2={plotXAxisYSVG} stroke="#555" strokeWidth="1"/>);
        elements.push(<text key="plot-x-label" x={plotAreaXStart + plotAreaPixelWidth / 2} y={plotXAxisYSVG + AXIS_PADDING / 1.8} textAnchor="middle" fontSize="11px" fill="#333">y (right +)</text>);

        // Vertical axis (PLOT's Y-axis, displays SCENE X data)
        const plotYAxisXSVG = plotAreaXStart;
        elements.push(<line key="plot-y-axis" x1={plotYAxisXSVG} y1={plotAreaYStart} x2={plotYAxisXSVG} y2={plotAreaYStart + plotAreaPixelHeight} stroke="#555" strokeWidth="1"/>);
        elements.push(
            <text key="plot-y-label" x={plotYAxisXSVG - AXIS_PADDING / 1.8} y={plotAreaYStart + plotAreaPixelHeight / 2} textAnchor="middle" fontSize="11px" fill="#333" transform={`rotate(-90, ${plotYAxisXSVG - AXIS_PADDING / 1.8}, ${plotAreaYStart + plotAreaPixelHeight / 2})`}>
                x (down +)
            </text>
        );

        // Ticks for Horizontal Axis (Plot's X-axis, using Scene Y data from currentDataForPlotXaxis)
        const [plot_x_data_min_tick, plot_x_data_max_tick] = currentDataForPlotXaxis;
        const plot_x_tick_range = plot_x_data_max_tick - plot_x_data_min_tick;
        if (plot_x_tick_range > 1e-6) {
            for (let i = 0; i <= NUM_TICKS; i++) {
                const dataVal = plot_x_data_min_tick + (i / NUM_TICKS) * plot_x_tick_range;
                const tickScreenX = plotAreaXStart + (i / NUM_TICKS) * plotAreaPixelWidth;
                elements.push(<line key={`plot-xtick-${i}`} x1={tickScreenX} y1={plotXAxisYSVG} x2={tickScreenX} y2={plotXAxisYSVG + TICK_LENGTH} stroke="#555" />);
                elements.push(<text key={`plot-xlabel-${i}`} x={tickScreenX} y={plotXAxisYSVG + TICK_LENGTH + 12} textAnchor="middle" fontSize="9px" fill="#444">{dataVal.toFixed(1)}</text>);
            }
        }

        // Ticks for Vertical Axis (Plot's Y-axis, using Scene X data from currentDataForPlotYaxis)
        const [plot_y_data_min_tick, plot_y_data_max_tick] = currentDataForPlotYaxis; // e.g. [min_scene_x, max_scene_x]
        const plot_y_tick_range = plot_y_data_max_tick - plot_y_data_min_tick;
        if (plot_y_tick_range > 1e-6) {
            for (let i = 0; i <= NUM_TICKS; i++) {
                const dataVal = plot_y_data_min_tick + (i / NUM_TICKS) * plot_y_tick_range; // Data increases downwards
                const tickScreenY = plotAreaYStart + (i / NUM_TICKS) * plotAreaPixelHeight; // SVG Y increases downwards
                elements.push(<line key={`plot-ytick-${i}`} x1={plotYAxisXSVG} y1={tickScreenY} x2={plotYAxisXSVG - TICK_LENGTH} y2={tickScreenY} stroke="#555" />);
                elements.push(<text key={`plot-ylabel-${i}`} x={plotYAxisXSVG - TICK_LENGTH - 4} y={tickScreenY + 3} textAnchor="end" fontSize="9px" fill="#444">{dataVal.toFixed(1)}</text>);
            }
        }
        return elements;
    };

    if (!plotMetadata || typeof plotMetadata.plot_target_width !== 'number' || typeof plotMetadata.plot_target_height !== 'number') {
        return <div className="placeholder-box" style={{width: '600px', height: '600px'}}>Error: Plot target dimensions missing.</div>;
    }
    if (!currentDataForPlotXaxis || !currentDataForPlotYaxis) { // Changed state variable names here
         return <div className="placeholder-box" style={{width: plotMetadata.plot_target_width, height: plotMetadata.plot_target_height}}>Calculating data limits...</div>;
    }

    return (
        <svg
            width={plotMetadata.plot_target_width}
            height={plotMetadata.plot_target_height}
            style={{ border: '1px solid #ccc', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif', overflow: 'visible' }}
        >
            {renderAxesAndTicks()}
            {objects.map(obj => {
                // obj.verts are [scene_y, scene_x] pairs
                if (!obj.verts || obj.verts.length < 3) return null;
                const pointsStr = obj.verts.map(v => {
                    // transformPoint expects (plot_x_axis_data (scene_y), plot_y_axis_data (scene_x))
                    const transformed = transformPoint(v[0], v[1]);
                    return `${transformed.x.toFixed(1)},${transformed.y.toFixed(1)}`;
                }).join(' ');

                let labelCenterX = plotAreaXStart, labelCenterY = plotAreaYStart;
                if (obj.verts.length > 0) {
                    let sumX = 0, sumY = 0; let validTransformedPoints = 0;
                    obj.verts.forEach(v => {
                        const tp = transformPoint(v[0], v[1]);
                        if (!isNaN(tp.x) && !isNaN(tp.y)) { sumX += tp.x; sumY += tp.y; validTransformedPoints++; }
                    });
                    if (validTransformedPoints > 0) { labelCenterX = sumX / validTransformedPoints; labelCenterY = sumY / validTransformedPoints; }
                }

                let highlight = 'none';
                if (selectedObjectIds?.primary === obj.id) highlight = 'blue';
                else if (selectedObjectIds?.reference === obj.id) highlight = 'green';

                return (
                    <BoundingBox
                        key={obj.id} id={obj.id} points={pointsStr} label={obj.label} color={obj.color}
                        isSelected={selectedObjectIds?.primary === obj.id || selectedObjectIds?.reference === obj.id}
                        highlightColor={highlight}
                        onClick={(e) => { e.stopPropagation(); onObjectClick(obj.id); }}
                        textX={labelCenterX} textY={labelCenterY}
                    />
                );
            })}
        </svg>
    );
}
export default JSPlotter;