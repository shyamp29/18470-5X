import React, { useState } from "react";
import { useAuth } from "../Auth/authHandler";
import { AUTH_ACTIONS } from "../Auth/authActions";
import LoginStyle from "../AppStyle/login";
import { apiCheckUserId } from "../Auth/apiCalls";

const SignupPage = () => {
  const { handleAuthAction } = useAuth();
  const [signupProps, setSignupProps] = useState({
    userId: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupProps((prev) => ({ ...prev, [name]: value }));
    if (name === "userId") setUserIdError("");
    if (name === "password" || name === "confirmPassword") setPasswordError("");
  };

  const handleUserIdBlur = async () => {
    if (!signupProps.userId) return;
    const res = await apiCheckUserId(signupProps.userId);
    if (res.success && res.exists) {
      setUserIdError("user id already exist");
    } else {
      setUserIdError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (signupProps.confirmPassword && signupProps.password !== signupProps.confirmPassword) {
      setPasswordError("passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const isFormBlocked = !!userIdError || !!passwordError;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isFormBlocked) return;
    await handleAuthAction(AUTH_ACTIONS.SIGNUP, signupProps);
  };

  const handleRedirect = () => {
    handleAuthAction(AUTH_ACTIONS.BACK_TO_LOGIN);
  }

  return (
    <div style={LoginStyle.container}>
      <div style={LoginStyle.topTrim}></div>

      <div style={LoginStyle.loginBox}>
        <h1 style={LoginStyle.header}>New User Sign-in</h1>

        <form onSubmit={handleSignup} style={LoginStyle.form}>
          <div style={LoginStyle.inputGroup}>
            <label>user name</label>
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
            <label>userID</label>
            <input
              name="userId"
              type="text"
              value={signupProps.userId}
              onChange={handleChange}
              onBlur={handleUserIdBlur}
              style={LoginStyle.input}
              required
            />
            {userIdError && <span style={{color: "red", fontSize: "12px"}}>{userIdError}</span>}
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>password</label>
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
            <label>confirm password</label>
            <input
              name="confirmPassword"
              type="password"
              value={signupProps.confirmPassword}
              onChange={handleChange}
              onBlur={handleConfirmPasswordBlur}
              style={LoginStyle.input}
              required
            />
            {passwordError && <span style={{color: "red", fontSize: "12px"}}>{passwordError}</span>}
          </div>

          <button type="submit" style={LoginStyle.submitBtn} disabled={isFormBlocked}>
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