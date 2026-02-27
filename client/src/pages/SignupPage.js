import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginStyle from "../AppStyle/style.js";

const SignupPage = () => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSignup({ userId, email, password, confirmPassword });
  };

  const handleSignup = async (e) => {
    //TODO: 
    console.log("signed up")
  };

  const handleLoginRedirect = (e) => {
    navigate("/");
  };

  return (
    <div style={LoginStyle.container}>
      <div style={LoginStyle.topTrim}></div>

      <div style={LoginStyle.loginBox}>
        <h1 style={LoginStyle.header}>Sign Up</h1>

        <form onSubmit={onSubmit} style={LoginStyle.form}>
          <div style={LoginStyle.inputGroup}>
            <label>User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={LoginStyle.input}
              required
            />
          </div>

          <button type="submit" style={LoginStyle.submitBtn}>
            Create Account
          </button>
        </form>

        <div style={LoginStyle.footer}>
          <div
            style={LoginStyle.footerLeft}
            onClick={handleLoginRedirect}
          >
            <p>Already have an account?</p>
            <p><strong>Login</strong></p>
          </div>
        </div>
      </div>

      <div style={LoginStyle.bottomTrim}></div>
    </div>
  );
};

export default SignupPage;