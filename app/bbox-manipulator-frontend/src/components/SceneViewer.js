import React, { useRef, useEffect, useState } from 'react';
import BoundingBox from './BoundingBox';

function SceneViewer({
    sceneImage,
    objects,
    plotMetadata,
    selectedObjectIds,
    onObjectClick // Changed from setSelectedObjectIds to a more generic onObjectClick
}) {
    const containerRef = useRef(null);
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setImageLoaded(false); // Reset image loaded state when sceneImage changes
    }, [sceneImage]);

    useEffect(() => {
        if (containerRef.current && plotMetadata && imageLoaded) {
            const displayContainerWidth = containerRef.current.offsetWidth;
            const serverPlotWidth = plotMetadata.plot_width_on_server;
            const serverPlotHeight = plotMetadata.plot_height_on_server;

            if (serverPlotWidth && serverPlotHeight && displayContainerWidth > 0) {
                const scaleFactor = displayContainerWidth / serverPlotWidth;
                setSvgSize({
                    width: serverPlotWidth * scaleFactor,
                    height: serverPlotHeight * scaleFactor,
                });
            } else if (serverPlotWidth && serverPlotHeight) {
                // Fallback if offsetWidth is not yet available, use server dimensions
                setSvgSize({
                    width: serverPlotWidth,
                    height: serverPlotHeight,
                });
            }
        } else if (plotMetadata) {
             // If image not loaded yet, but we have metadata, set initial size based on server plot dimensions
             // This helps if the containerRef.offsetWidth isn't immediately available
            setSvgSize({
                width: plotMetadata.plot_width_on_server || 800,
                height: plotMetadata.plot_height_on_server || 800,
            });
        }
    }, [containerRef.current?.offsetWidth, plotMetadata, imageLoaded]);

    const transformPoint = (data_y, data_x) => {
        if (!plotMetadata || !plotMetadata.xlim || !plotMetadata.ylim || !svgSize.width || !svgSize.height) {
            // This warning should ideally not appear if plotMetadata is correctly handled upstream
            // console.warn("Plot metadata or svgSize missing/invalid for coordinate transformation.");
            return { x: 0, y: 0 };
        }

        const [y_data_min, y_data_max] = plotMetadata.xlim;
        const [x_data_max_val_at_top, x_data_min_val_at_bottom] = plotMetadata.ylim;

        // Prevent division by zero if data range is zero
        const y_range = y_data_max - y_data_min;
        const x_range = x_data_min_val_at_bottom - x_data_max_val_at_top;

        if (y_range === 0 || x_range === 0) {
            // console.warn("Data range for an axis is zero, cannot transform points.");
            return { x: 0, y: 0 };
        }

        const svg_x = ((data_y - y_data_min) / y_range) * svgSize.width;
        const svg_y = ((data_x - x_data_max_val_at_top) / x_range) * svgSize.height;

        return { x: svg_x, y: svg_y };
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    if (!sceneImage) return <p>Load a scene to view.</p>;
    if (!plotMetadata && !objects.length) return <p>Loading scene metadata and objects...</p>;
    if (!plotMetadata && objects.length > 0) return <p>Plot metadata is missing. Cannot render interactive regions.</p>

    // Determine the initial width for the container based on plot metadata to guide scaling
    const initialContainerWidth = plotMetadata?.plot_width_on_server ? `${plotMetadata.plot_width_on_server}px` : '600px';

    return (
        <div
            ref={containerRef}
            className="scene-viewer-display"
            style={{
                position: 'relative',
                width: initialContainerWidth, // Set an initial width to help with scaling
                maxWidth: '100%', // Allow it to shrink responsively
            }}
        >
            <img
                src={sceneImage}
                alt="Scene"
                style={{ display: 'block', width: '100%', opacity: imageLoaded ? 1 : 0.5 }}
                onLoad={handleImageLoad}
                onError={() => {console.error("Failed to load scene image:", sceneImage); setImageLoaded(true); /* still allow svg if image fails */}}
            />
            {(imageLoaded && svgSize.width > 0 && svgSize.height > 0 && objects.length > 0) && (
                <svg
                    width={svgSize.width}
                    height={svgSize.height} // Only overlay the top (plotted) part
                    style={{ position: 'absolute', top: -400, left: 700, pointerEvents: 'none' }}
                >
                    {objects.map(obj => {
                        if (!obj.verts || obj.verts.length < 3) return null;

                        const pointsStr = obj.verts.map(p => {
                            const transformed = transformPoint(p[0], p[1]);
                            return `${transformed.x.toFixed(2)},${transformed.y.toFixed(2)}`;
                        }).join(' ');

                        let sumRenderX = 0, sumRenderY = 0;
                        let validPoints = 0;
                        obj.verts.forEach(p => {
                            const transformed = transformPoint(p[0], p[1]);
                            if (!isNaN(transformed.x) && !isNaN(transformed.y)) {
                                sumRenderX += transformed.x;
                                sumRenderY += transformed.y;
                                validPoints++;
                            }
                        });
                        const labelCenterX = validPoints > 0 ? sumRenderX / validPoints : 0;
                        const labelCenterY = validPoints > 0 ? sumRenderY / validPoints : 0;

                        return (
                            <BoundingBox
                                key={obj.id}
                                id={obj.id}
                                points={pointsStr}
                                label={obj.label}
                                color={obj.color}
                                isSelected={selectedObjectIds.includes(obj.id)}
                                onClick={(e) => onObjectClick(obj.id, e)}
                                textX={labelCenterX}
                                textY={labelCenterY}
                            />
                        );
                    })}
                </svg>
            )}
            {!imageLoaded && <p>Loading image...</p>}
        </div>
    );
}

export default SceneViewer;