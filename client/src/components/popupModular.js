import React from 'react';
import PopupStyles from '../AppStyle/popup';

const ErrorPopup = ({ showPopup, closePopup, children }) => {
    if (!showPopup) {
        return null;
    }
    const handleOverlayClick = (e) => {
    if (e.target.id === 'popup-overlay') {
      closePopup();
    }
  };
  return (
    <div
      id="popup-overlay"
      onClick={handleOverlayClick}
      style = {PopupStyles.overlay}
     className="popup-overlay" 
    >
      <div className="popup-content" style={PopupStyles.content}>
        <button onClick={closePopup} className="popup-close-button">
          Close
        </button>
        {children} {/* content */}
      </div>
    </div>
  );
};

const SuccessPopup = () => {

};

const LoadingPopup = () => {

};

export { ErrorPopup, SuccessPopup, LoadingPopup };