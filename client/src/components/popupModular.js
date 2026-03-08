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

const SuccessPopup = ({ showPopup, msg, onClose }) => {
  if (!showPopup) return null;

  return (
    <div style={PopupStyles.overlay}>
      <div style={{ ...PopupStyles.content }}>
        <button onClick={onClose} style={{ ...PopupStyles.closeBtn }}>&times;</button>
        <h2 style={{ color: '#111010', margin: '0 0 10px 0' }}>Account Created!</h2>
        <p style={{ marginTop: '15px', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Details have been sent to:<br />
          <strong style={{ fontSize: '1.1rem' }}>{maskEmail(msg)}</strong>
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

const ForgetPopup = ({ showPopup, msg, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);

  if (!showPopup) return null;

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value === "") {
      setIsValid(true);
    } else {
      setIsValid(validateEmail(value));
    }
  };

  const handleSubmit = () => {
    if (validateEmail(email)) {
      onSubmit(email); 
      setEmail(""); 
    } else {
      setIsValid(false);
    }
  };

  return (
    <div style={PopupStyles.overlay}>
      <div style={{ ...PopupStyles.content }}>
        <button onClick={onClose} style={{ ...PopupStyles.closeBtn }}>&times;</button>
        <h2 style={{ color: '#111010', margin: '0 0 10px 0' }}>
          Forgot {msg.type === 'ID' ? 'ID' : 'Password'}
        </h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
          Enter registered email.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          style={{...LoginStyle.input, marginBottom: '0px'}}
        />
       
       <div style={{ height: '20px', marginTop: '5px' }}>
          {!isValid && (
            <p style={{ color: '#ff0000', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
              Email not valid
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || email === ""}
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