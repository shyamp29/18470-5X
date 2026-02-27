const LoginStyle = {
  container: {
    display: "flex",
    position: 'relative',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100dvh",
    width: "100vw",
    margin: 0,
    backgroundColor: "#f4f6f9",
    fontFamily: "Arial, sans-serif",
  },

  topTrim: {
    width: "100%",
    height: "35px",
    backgroundColor: "#c65c1a",
    position: "absolute",
    top: 0,
    left: 0,
  },

  bottomTrim: {
    width: "100%",
    height: "50px",
    backgroundColor: "#c65c1a",
    position: "absolute",
    bottom: 0,
    left: 0,
  },

  loginBox: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px #c65c1a",
    width: "350px",
    zIndex: 1,
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#2c3e50",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#121111",
  },

  input: {
    marginTop: "6px",
    padding: "10px",
    borderRadius: "6px",
    backgroundColor: "#ede4de",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },

  submitBtn: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#c65c1a",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
    fontSize: "13px",
  },

  footerLeft: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    color: "#2c3e50",
  },

  footerRight: {
    textAlign: "right",
  },

  link: {
    cursor: "pointer",
    color: "#3498db",
    margin: "4px 0",
  },
};

export default LoginStyle;