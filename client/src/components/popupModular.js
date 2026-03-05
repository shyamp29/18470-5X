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

const SuccessPopup = ({ showPopup, email, onClose }) => {
  if (!showPopup) return null;

  return (
    <div style={PopupStyles.overlay}>
      <div style={{ ...PopupStyles.content, backgroundColor: '#e6fffa', borderColor: '#38a169' }}>
        <button onClick={onClose} style={{ ...PopupStyles.closeX, color: '#2f855a' }}>&times;</button>
        <h2 style={{ color: '#c65c1a', margin: '0 0 10px 0' }}>Account Created!</h2>
        <p style={{ marginTop: '15px', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Details have been sent to:<br/>
          <strong style={{ fontSize: '1.1rem' }}>{maskEmail(email)}</strong>
        </p>        
        <button 
          onClick={onClose} 
          style={{ ...LoginStyle.submitBtn, marginTop: '20px', backgroundColor: '#38a169' }}
        >
          Login
        </button>
      </div>
    </div>
  );
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

const maskEmail = (email) => {
  if (!email) return "";
  const [prefix, domain] = email.split("@");
  const [domainName, extension] = domain.split(".");
  
  // Keep first 3 chars of prefix, mask the rest
  const maskedPrefix = prefix.substring(0, 3) + "*".repeat(Math.max(0, prefix.length - 3));
  // Keep first 1 char of domain, mask the rest
  const maskedDomain = domainName.substring(0, 1) + "*".repeat(Math.max(0, domainName.length - 1));
  
  return `${maskedPrefix}@${maskedDomain}.${extension}`;
};

export { ErrorPopup, SuccessPopup, LoadingPopup };