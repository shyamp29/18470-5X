const PopupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(2px)',
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
    position: 'absolute',
    top: '10px', right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#c65c1a',
    padding: '0',
    lineHeight: '1',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

export default PopupStyles;