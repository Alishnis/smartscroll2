import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, count = 1, style }) => {
    const renderSkeleton = () => {
        const skeletons = [];
        for (let i = 0; i < count; i++) {
            skeletons.push(
                <div
                    key={i}
                    className={`skeleton ${type}`}
                    style={style}
                ></div>
            );
        }
        return skeletons;
    };

    return <div className="skeleton-wrapper">{renderSkeleton()}</div>;
};

export default Skeleton;
