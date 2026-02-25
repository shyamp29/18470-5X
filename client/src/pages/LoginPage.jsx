import React, { useState } from 'react';
import LoginStyle from "../AppStyle/style.js";

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // BACKEND CONNECTION PLACEHOLDERS
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Connecting to backend...");
    console.log("Sending Encrypted Data:", { userId, password });
    
    // TODO: Implement actual fetch request here
    // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({userId, password}) });
  };

  const handleForgotPassword = (type) => {
    console.log(`Redirecting to forgot ${type} logic...`);
  };

  const handleNewUser = () => {
    console.log("Redirecting to Sign-in / Registration...");
  };

  return (
    <div style={LoginStyle.container}>
      <div style={LoginStyle.loginBox}>
        <h1 style={LoginStyle.header}>Login</h1>
        
        <form onSubmit={handleLogin} style={LoginStyle.form}>
          <div style={LoginStyle.inputGroup}>
            <label>user ID</label>
            <input 
              type="text" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              style={LoginStyle.input}
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={LoginStyle.input}
            />
          </div>

          <button type="submit" style={LoginStyle.submitBtn}>Submit</button>
        </form>

        <div style={LoginStyle.footer}>
          <div style={LoginStyle.footerLeft} onClick={handleNewUser}>
            <p>New User?</p>
            <p><strong>Sign-in</strong></p>
          </div>
          
          <div style={LoginStyle.footerRight}>
            <p onClick={() => handleForgotPassword('id')} style={LoginStyle.link}>
              Forgot user_id?
            </p>
            <p onClick={() => handleForgotPassword('password')} style={LoginStyle.link}>
              Forgot password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
