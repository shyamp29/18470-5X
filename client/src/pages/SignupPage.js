import { useState } from "react";
import { useAuth } from "../Auth/authHandler";
import LoginStyle from "../AppStyle/login";
import '../styles/SignupPage.css';
import PasswordInput from "../components/PasswordInput";

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
        <div style={LoginStyle.loginBody}>
        <img src="/logo.png" alt="5X HaaS Portal" style={LoginStyle.logo} />
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
            <PasswordInput
              name="password"
              value={signupProps.password}
              onChange={handleChange}
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>confirm password</label>
            <PasswordInput
              name="confirmPassword"
              value={signupProps.confirmPassword}
              onChange={handleChange}
              onBlur={handleConfirmPasswordBlur}
            />
            {passwordError && <span className="password-error">{passwordError}</span>}
          </div>

          <button type="submit" style={LoginStyle.submitBtn} disabled={isFormBlocked}>
            Create Account
          </button>
        </form>
        </div>

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