// src/components/SceneSelector.js
import React, { useState, useEffect } from 'react';

function SceneSelector({ currentTaskId, onSetCurrentTaskId }) { // Renamed prop
    const [inputValue, setInputValue] = useState(currentTaskId);

    useEffect(() => {
        // Sync local input with currentTaskId from App if it changes (e.g., via Prev/Next)
        setInputValue(currentTaskId);
    }, [currentTaskId]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSetCurrentTaskId(inputValue.trim()); // Update App's currentTaskId; useEffect will fetch
        }
    };

    return (
        <form onSubmit={handleSubmit} className="scene-selector-form">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter Scene Task ID (e.g., 01_0)"
                className="scene-id-input"
            />
            <button type="submit" className="control-button">Load Scene by ID</button>
        </form>
    );
}

export default SceneSelector;