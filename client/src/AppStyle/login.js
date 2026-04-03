const LoginStyle = {
  container: {
    display: "flex",
    position: 'relative',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100dvh",
    width: "100vw",
    overflow: "hidden",
    margin: 0,
    backgroundColor: "var(--color-page-bg)",
    fontFamily: "var(--font-family)",
  },

  topTrim: {
    width: "100%",
    height: "var(--trim-height)",
    backgroundColor: "var(--color-primary)",
    position: "absolute",
    top: 0,
    left: 0,
  },

  bottomTrim: {
    width: "100%",
    height: "var(--trim-height)",
    backgroundColor: "var(--color-primary)",
    position: "absolute",
    bottom: 0,
    left: 0,
  },

  loginBox: {
    backgroundColor: "var(--color-card-bg)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-login-card)",
    width: "clamp(360px, 50vw, 480px)",
    minHeight: "50dvh",
    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  loginBody: {
    padding: "40px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  logo: {
    display: "block",
    margin: "0 auto 10px auto",
    width: "120px",
    mixBlendMode: "multiply",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
    color: "var(--color-text-dark)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
    fontSize: "var(--font-size-md)",
    color: "var(--color-text-near-black)",
  },

  input: {
    marginTop: "8px",
    padding: "14px 16px",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-input-bg)",
    border: "1px solid var(--color-input-border)",
    fontSize: "var(--font-size-lg)",
    outline: "none",
    color: "var(--color-text-near-black)",
  },

  submitBtn: {
    marginTop: "14px",
    padding: "16px",
    backgroundColor: "var(--color-primary)",
    color: "#ffffff",
    border: "none",
    borderRadius: "var(--radius-xl)",
    cursor: "pointer",
    fontSize: "var(--font-size-lg)",
    fontWeight: "var(--font-weight-bold)",
  },

  footer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "var(--color-primary-transparent)",
    borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
    fontSize: "var(--font-size-sm)",
  },

  footerLeft: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "5px",
    fontSize: "var(--font-size-sm)",
    color: "var(--color-text-dark)",
  },

  footerRight: {
    textAlign: "right",
  },

  link: {
    cursor: "pointer",
    color: "var(--color-link)",
    margin: "4px 0",
    fontWeight: "var(--font-weight-semibold)",
  },
};

export default LoginStyle;
