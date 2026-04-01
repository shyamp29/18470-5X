import React, { useState } from 'react';
import LoginStyle from "../AppStyle/login";
import { useAuth } from "../Auth/authHandler";
import { ErrorPopup} from "../components/popupModular";

const LoginPage = () => {
  const { login, goToSignup, showForgotPassword } = useAuth();
  const [loginProps, setLoginProps] = useState({ userId: '', password: '' });
  
  const [showErrPopup, setShowErrPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginProps(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    /*
    * IF both the password + userID field are empty
    * DON't do anything
    * IF only the password field is empty 
    * DO send error message
    * IF the userID + password is not in the account
    * DO send error message
    */

    if (!loginProps.userId && !loginProps.password) return;
    if (loginProps.userId && !loginProps.password) {
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
        <h1 style={LoginStyle.header}>Login</h1>

        <form onSubmit={handleLogin} style={LoginStyle.form}>
          <div style={LoginStyle.inputGroup}>
            <label>User ID</label>
            <input
              type="text"
              name="userId"
              value={loginProps.userId}
              onChange={handleChange}
              style={LoginStyle.input}
            />
          </div>
          <div style={LoginStyle.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginProps.password}
              onChange={handleChange}
              style={LoginStyle.input}
            />
          </div>
          <button type="submit" style={LoginStyle.submitBtn}>Submit</button>
        </form>

        <ErrorPopup
          showPopup={showErrPopup}
          onClose={() => setShowErrPopup(false)}
          message={message}
        >
          <h2 style={{ color: '#d9534f' }}>Login Error</h2>
        </ErrorPopup>

        <div style={LoginStyle.footer}>
          <div style={LoginStyle.footerLeft}>
            <p>New User?</p>
            <span
              style={LoginStyle.link}
              onClick={goToSignup}
            >
              <strong>Sign-up</strong>
            </span>
          </div>
          <div style={LoginStyle.footerRight}>
            <p onClick={showForgotPassword} style={LoginStyle.link}>
              Forgot password?
            </p>
          </div>
        </div>
      </div>
      <div style={LoginStyle.bottomTrim}></div>
    </div>
  );
};

export default LoginPage;
