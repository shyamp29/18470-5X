import { useState, useEffect } from 'react';
import PopupStyles from '../../AppStyle/popup';

const AnimatedDots = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length < 3 ? prev + '.' : '');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return <span style={PopupStyles.animatedDots}>{dots}</span>;
};

const LoadingPopup = ({ showPopup, message }) => {
    if (!showPopup) return null;

    return (
        <div style={PopupStyles.overlay}>
            <div style={{ ...PopupStyles.content, ...PopupStyles.loadingContent }}>
                <p style={{ fontWeight: 'bold' }}>{message || "Loading "}<AnimatedDots /></p>
            </div>
        </div>
    );
};

export default LoadingPopup;
