import { useState } from "react";
import { useAuth } from "../Auth/authHandler";
import LoginStyle from "../AppStyle/login";
import '../styles/SignupPage.css';
import PasswordInput from "../components/PasswordInput";

const SignupPage = () => {
  const { register, goToLogin } = useAuth();
  const [signupProps, setSignupProps] = useState({
    userid: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...signupProps, [name]: value };
    setSignupProps(updated);

    if (name === "confirmPassword" || name === "password") {
      const confirm = name === "confirmPassword" ? value : updated.confirmPassword;
      if (confirm.length >= 2) {
        setPasswordError(updated.password !== updated.confirmPassword ? "Passwords do not match" : "");
      } else {
        setPasswordError("");
      }
    }
  };

  const hasEmptyFields = !signupProps.username || !signupProps.userid || !signupProps.password || !signupProps.confirmPassword;
  const isFormBlocked = !!passwordError || hasEmptyFields;

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
        <h1 style={LoginStyle.header}>New User</h1>

        <form onSubmit={handleSignup} style={LoginStyle.form}>
          <div style={LoginStyle.inputGroup}>
            <label>User Name</label>
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
            <label>User ID</label>
            <input
              name="userid"
              type="text"
              value={signupProps.userid}
              onChange={handleChange}
              style={LoginStyle.input}
              required
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Password</label>
            <PasswordInput
              name="password"
              value={signupProps.password}
              onChange={handleChange}
            />
          </div>

          <div style={LoginStyle.inputGroup}>
            <label>Confirm Password</label>
            <PasswordInput
              name="confirmPassword"
              value={signupProps.confirmPassword}
              onChange={handleChange}
            />
            {passwordError && <span className="password-error">{passwordError}</span>}
          </div>

          <button
            type="submit"
            style={{
              ...LoginStyle.submitBtn,
              ...(isFormBlocked && { backgroundColor: "var(--color-disabled)", cursor: "not-allowed" }),
            }}
            disabled={isFormBlocked}
          >
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