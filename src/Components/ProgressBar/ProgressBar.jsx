import React from 'react'

const ProgressBar = ({ progress }) => {

    return (
        <div style={{ width: '100%', height: '20px', border: '1px solid #ccc' }}>
            <div
                style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50',
                }}
            />
        </div>
    );
}

export default ProgressBar;