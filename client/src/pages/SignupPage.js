import { useState } from "react";
import { useAuth } from "../Auth/authHandler";
import LoginStyle from "../AppStyle/login";
import '../styles/SignupPage.css';

const SignupPage = () => {
  const { register, goToLogin } = useAuth();
  const [signupProps, setSignupProps] = useState({
    userId: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupProps((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") setPasswordError("");
  };

  const handleConfirmPasswordBlur = () => {
    if (signupProps.confirmPassword && signupProps.password !== signupProps.confirmPassword) {
      setPasswordError("passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const isFormBlocked = !!passwordError;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isFormBlocked) return;
    await register(signupProps);
  };

  const handleRedirect = () => {
    goToLogin();
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
              name="username"
              type="text"
              value={signupProps.username}
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
              style={LoginStyle.input}
              required
            />
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
            {passwordError && <span className="password-error">{passwordError}</span>}
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