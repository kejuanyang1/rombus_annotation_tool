import React from 'react';

function BoundingBox({ id, points, label, color, isSelected, highlightColor, onClick, textX, textY }) {
    let strokeColor = 'black';
    let strokeWidth = 1;
    let effectiveFill = color || 'rgba(0,0,255,0.3)';
    let textColor = '#333'; // Default text color

    const specialObjectKeywords = ['lid', 'bowl', 'basket', 'support', 'base'];
    const isSpecialObject = specialObjectKeywords.some(keyword => label.toLowerCase().includes(keyword));

    if (isSpecialObject && color) {
        textColor = color;
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
            <text
                x={textX}
                y={textY}
                fontSize="10"
                fill={textColor}
                textAnchor="middle"
                dominantBaseline="middle"
                paintOrder="stroke"
                stroke="white"
                strokeWidth="2px"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: '500' }}
            >
                {label}
            </text>
            <text // Fallback for browsers that don't support paintOrder well
                x={textX}
                y={textY}
                fontSize="10"
                fill={textColor}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ pointerEvents: 'none', userSelect: 'none', fontWeight: '500' }}
            >
                {label}
            </text>
        </g>
    );
}
export default BoundingBox;