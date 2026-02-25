const LoginStyle = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  loginBox: {
    border: '1px solid black',
    padding: '40px',
    width: '400px',
    position: 'relative'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  inputGroup: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: '10px',
    padding: '5px',
    width: '200px',
    border: '1px solid #777'
  },
  submitBtn: {
    backgroundColor: '#add8e6', // Light blue from image
    border: '1px solid #777',
    padding: '10px 25px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  footer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem'
  },
  footerLeft: {
    cursor: 'pointer'
  },
  footerRight: {
    textAlign: 'right'
  },
  link: {
    cursor: 'pointer',
    margin: '5px 0'
  }
};
export default LoginStyle;
