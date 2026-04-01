const PopupStyles = {

    // ── Overlay & container ───────────────────────────────────────────────────
    overlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
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
        width: '90%',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    },
    loadingContent: {
        backgroundColor: '#c65c1a26',
    },

    // ── Chrome ────────────────────────────────────────────────────────────────
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
    },

    // ── Typography ────────────────────────────────────────────────────────────
    title: {
        color: '#111010',
        margin: '0 0 10px 0',
    },
    description: {
        marginTop: '15px',
        fontSize: '0.9rem',
        lineHeight: '1.5',
    },
    bodyPadding: {
        padding: '10px',
    },
    bodyText: {
        fontSize: '1.2rem',
        margin: 0,
    },

    // ── Action button ─────────────────────────────────────────────────────────
    actionBtn: {
        marginTop: '20px',
        padding: '12px',
        width: '100%',
        backgroundColor: '#c65c1a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: 'bold',
    },

    // ── Form (ForgetPopup) ────────────────────────────────────────────────────
    formRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '8px',
    },
    formInput: {
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: '#eed2c0',
        border: '1px solid #ccc',
        fontSize: '14px',
        outline: 'none',
        flex: 1,
    },
    formInputFull: {
        padding: '10px',
        borderRadius: '6px',
        backgroundColor: '#eed2c0',
        border: '1px solid #ccc',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    spacer: {
        height: '20px',
    },

    // ── Loading ───────────────────────────────────────────────────────────────
    animatedDots: {
        textAlign: 'left',
        display: 'inline-block',
        width: '20px',
    },
};

export default PopupStyles;
