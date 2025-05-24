import React from 'react';

function BoundingBox({ id, points, label, color, isSelected, highlightColor, onClick, textX, textY, refDotX, refDotY }) {
    let strokeColor = 'black';
    let strokeWidth = 1;
    let effectiveFill = color || 'rgba(0,0,255,0.3)';
    let textColor = '#333';

    const labelString = typeof label === 'string' ? label : '';
    const specialObjectKeywords = ['lid', 'bowl', 'basket', 'support', 'base'];
    const isSpecialObject = specialObjectKeywords.some(keyword => labelString.toLowerCase().includes(keyword));

    if (isSpecialObject && color) {
        textColor = 'black'; // Ensure contrast for special objects
    }

    if (isSelected) {
        strokeColor = highlightColor !== 'none' ? highlightColor : 'lime';
        strokeWidth = 2.5;
    }


    return (
        <g onClick={onClick} style={{ pointerEvents: 'all', cursor: 'pointer' }}>
            <polygon
                points={points}
                fill={effectiveFill}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
            />
            {/* Reference Dot */}
            {refDotX !== undefined && refDotY !== undefined && (
                <circle
                    cx={refDotX}
                    cy={refDotY}
                    r="5" 
                    fill={isSelected ? strokeColor : "red"} 
                    stroke="white"
                    strokeWidth="1.5"
                    style={{ pointerEvents: 'none' }}
                />
            )}
            <text
                x={textX}
                y={textY}
                fontSize="10"
                fill={textColor}
                textAnchor="middle"
                dominantBaseline="middle"
                paintOrder="stroke" 
                stroke="white"      
                strokeWidth="2.5px" 
                strokeLinejoin="round"
                style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: 'bold' }}
            >
                {labelString}
            </text>
            <text // Fallback
                x={textX}
                y={textY}
                fontSize="10"
                fill={textColor}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: 'bold' }}
            >
                {labelString}
            </text>
        </g>
    );
}
export default BoundingBox;