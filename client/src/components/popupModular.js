import React from 'react';
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

const LoadingPopup = () => {

};

export { ErrorPopup, SuccessPopup, LoadingPopup };