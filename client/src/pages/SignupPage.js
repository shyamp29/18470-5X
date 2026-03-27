import React, { useState } from "react";
import { useAuth } from "../Auth/authHandler";
import { AUTH_ACTIONS } from "../Auth/authActions";
import LoginStyle from "../AppStyle/login";

const SignupPage = () => {
  const { handleAuthAction } = useAuth();
  const [signupProps, setSignupProps] = useState({
    userId: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupProps((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupProps.password !== signupProps.confirmPassword) {
      alert("Passwords must match!");
      return;
    }
    console.log("signed up");
    await handleAuthAction(AUTH_ACTIONS.SIGNUP, signupProps);
  };

  const handleRedirect = () => {
    handleAuthAction(AUTH_ACTIONS.BACK_TO_LOGIN);
  }

  return (
    <div style={LoginStyle.container}>
      <div style={LoginStyle.topTrim}></div>

      <div style={LoginStyle.loginBox}>
        <h1 style={LoginStyle.header}>Sign Up</h1>

        <form onSubmit={handleSignup} style={LoginStyle.form}>
          <div style={LoginStyle.inputGroup}>
            <label>User ID</label>
            <input
              name="userId"
              type="text"
              value={signupProps.userId}
              onChange={handleChange}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>User Name</label>
            <input
              name="userName"
              type="text"
              value={signupProps.userName}
              onChange={handleChange}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={signupProps.email}
              onChange={handleChange}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={signupProps.password}
              onChange={handleChange}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={signupProps.confirmPassword}
              onChange={handleChange}
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
            onClick={handleRedirect}
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