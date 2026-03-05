import React, { useState, useEffect } from 'react';
import PopupStyles from '../AppStyle/popup';

const ErrorPopup = ({ showPopup, closePopup, message }) => {
  if (!showPopup) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === 'popup-overlay') closePopup();
  };

  return (
    <div
      id="popup-overlay"
      onClick={handleOverlayClick}
      style={PopupStyles.overlay}
      className="popup-overlay"
    >
      <div className="popup-content" style={PopupStyles.content}>
        <button onClick={closePopup} style={PopupStyles.closeBtn}>
          X
        </button>
        <div style={{ padding: '10px' }}>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

const SuccessPopup = () => {

};

const LoadingPopup = ({ showPopup, message }) => {
  if (!showPopup) return null;

  return (
    <div style={PopupStyles.overlay}>
      <div style={{ ...PopupStyles.content, backgroundColor: '#c65c1a26' }}>
        <p style={{ fontWeight: 'bold' }}>{message || "Loading "}<AnimatedDots/></p>
      </div>
    </div>
  );
};

const AnimatedDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span style={{ textAlign: 'left', display: 'inline-block', width: '20px' }}>{dots}</span>;
};

export { ErrorPopup, SuccessPopup, LoadingPopup };