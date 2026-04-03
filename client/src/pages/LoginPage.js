import React, { useState } from 'react';
import LoginStyle from "../AppStyle/login";
import { useAuth } from "../Auth/authHandler";
import '../styles/LoginPage.css';
import { ErrorPopup } from "../components/popups";
import PasswordInput from "../components/PasswordInput";

const LoginPage = () => {
  const { login, goToSignup, showForgotPassword } = useAuth();
  const [loginProps, setLoginProps] = useState({ userid: '', password: '' });

  const [showErrPopup, setShowErrPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginProps(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginProps.userid && !loginProps.password) return;
    if (loginProps.userid && !loginProps.password) {
      setMessage("Password field cannot be empty.");
      setShowErrPopup(true);
      return;
    }

    await login(loginProps);
  };


  return (
    <div style={LoginStyle.container}>
      <div style={LoginStyle.topTrim}></div>
      <div style={LoginStyle.loginBox}>
        <div style={LoginStyle.loginBody}>
          <img src="/logo.png" alt="5X HaaS Portal" style={LoginStyle.logo} />
          <form onSubmit={handleLogin} style={LoginStyle.form}>
            <div style={LoginStyle.inputGroup}>
              <label htmlFor="userid">User ID</label>
              <input
                id="userid"
                type="text"
                name="userid"
                value={loginProps.userid}
                onChange={handleChange}
                autoComplete="username"
                style={LoginStyle.input}
              />
            </div>
            <div style={LoginStyle.inputGroup}>
              <label htmlFor="password">Password</label>
              <PasswordInput
                id="password"
                name="password"
                value={loginProps.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <span
              style={{ ...LoginStyle.link, textAlign: "right", marginTop: "6px" }}
              onClick={showForgotPassword}
            >
              Forgot password?
            </span>
            <button type="submit" style={LoginStyle.submitBtn}>
              Sign In
              <span style={LoginStyle.submitBtnArrow}>→</span>
            </button>
          </form>
        </div>

        <ErrorPopup
          showPopup={showErrPopup}
          onClose={() => setShowErrPopup(false)}
          message={message}
        >
          <h2 className="login-error-heading">Login Error</h2>
        </ErrorPopup>

        <div style={LoginStyle.footer}>
          <span style={{ color: "var(--color-text-dark)" }}>New User?&nbsp;</span>
          <span style={LoginStyle.link} onClick={goToSignup}>
            <strong>Create an account</strong>
          </span>
        </div>
      </div>
      <div style={LoginStyle.bottomTrim}></div>
    </div>
  );
};

export default LoginPage;
