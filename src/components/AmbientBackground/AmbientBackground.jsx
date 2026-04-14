import React from 'react';
import './AmbientBackground.css';

const AmbientBackground = ({ children }) => {
    return (
        <div className="ambient-wrapper">
            <div className="ambient-layer ambient-grid" />
            <div className="ambient-layer ambient-noise" />
            <div className="ambient-layer ambient-blobs">
                <div className="blob blob-primary" />
                <div className="blob blob-secondary" />
                <div className="blob blob-tertiary" />
                <div className="blob blob-accent" />
            </div>
            <div className="ambient-content">
                {children}
            </div>
        </div>
    );
};

export default AmbientBackground;
