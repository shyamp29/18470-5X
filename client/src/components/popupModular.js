import React, { useState, useEffect } from 'react';
import PopupStyles from '../AppStyle/popup';
import LoginStyle from '../AppStyle/login';

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

const SuccessPopup = ({ showPopup, message, msg, onClose }) => {
  if (!showPopup) return null;
  const text = message ?? msg;

  return (
    <div style={PopupStyles.overlay}>
      <div style={{ ...PopupStyles.content }}>
        <button onClick={onClose} style={{ ...PopupStyles.closeBtn }}>&times;</button>
        <h2 style={{ color: '#111010', margin: '0 0 10px 0' }}>New User Sign-up</h2>
        <p style={{ marginTop: '15px', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {text}
        </p>
        <button
          onClick={onClose}
          style={{ ...LoginStyle.submitBtn, marginTop: '20px', backgroundColor: '#c65c1a' }}
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
        <p style={{ fontWeight: 'bold' }}>{message || "Loading "}<AnimatedDots /></p>
      </div>
    </div>
  );
};

const ForgetPopup = ({ showPopup, onClose, onSubmit }) => {
  const [fields, setFields] = useState({ userId: "", userName: "" });

  if (!showPopup) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(fields);
    setFields({ userId: "", userName: "" });
  };

  const isReady = fields.userId.trim() !== "" && fields.userName.trim() !== "";

  return (
    <div style={PopupStyles.overlay}>
      <div style={{ ...PopupStyles.content }}>
        <button onClick={onClose} style={{ ...PopupStyles.closeBtn }}>&times;</button>
        <h2 style={{ color: '#111010', margin: '0 0 10px 0' }}>Forgot Password</h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Enter your User ID and Username.</p>
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={fields.userId}
          onChange={handleChange}
          style={{ ...LoginStyle.input, marginBottom: '8px' }}
        />
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={fields.userName}
          onChange={handleChange}
          style={{ ...LoginStyle.input, marginBottom: '0px' }}
        />
        <div style={{ height: '20px' }} />
        <button
          onClick={handleSubmit}
          disabled={!isReady}
          style={{ ...LoginStyle.submitBtn, backgroundColor: '#c65c1a' }}
        >
          Send Reset Link
        </button>
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

  const maskedPrefix = prefix.substring(0, 3) + "*".repeat(Math.max(0, prefix.length - 3));

  const maskedDomain = domainName.substring(0, 1) + "*".repeat(Math.max(0, domainName.length - 1));

  return `${maskedPrefix}@${maskedDomain}.${extension}`;
};

export { ErrorPopup, SuccessPopup, LoadingPopup, ForgetPopup };