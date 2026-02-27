const PopupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '400px',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  closeBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#c65c1a', 
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default PopupStyles;