import React from 'react';

function SceneSelector({ onSelectScene, setCurrentTaskId, currentTaskId }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentTaskId.trim()) {
            onSelectScene(currentTaskId.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="scene-selector-form">
            <input
                type="text"
                value={currentTaskId}
                onChange={(e) => setCurrentTaskId(e.target.value)}
                placeholder="Enter Scene Task ID (e.g., 01_0)"
                className="scene-id-input"
            />
            <button type="submit" className="control-button">Load Scene</button>
        </form>
    );
}

export default SceneSelector;