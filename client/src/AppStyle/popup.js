const PopupStyles = {

    // ── Overlay & container ───────────────────────────────────────────────────
    overlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'var(--color-overlay-dark)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        backgroundColor: 'var(--color-card-bg)',
        padding: '30px',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        position: 'relative',
        boxShadow: 'var(--shadow-popup)',
    },
    loadingContent: {
        backgroundColor: 'var(--color-primary-tint)',
    },

    // ── Chrome ────────────────────────────────────────────────────────────────
    closeBtn: {
        position: 'absolute',
        top: '10px', right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '28px',
        color: 'var(--color-primary)',
        padding: '0',
        lineHeight: '1',
        cursor: 'pointer',
        fontWeight: 'var(--font-weight-bold)',
    },

    // ── Typography ────────────────────────────────────────────────────────────
    title: {
        color: 'var(--color-text-near-black)',
        margin: '0 0 10px 0',
    },
    description: {
        marginTop: '15px',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        color: 'var(--color-text-primary)',
    },
    bodyPadding: {
        padding: '10px',
    },
    bodyText: {
        fontSize: '1.2rem',
        margin: 0,
        color: 'var(--color-text-primary)',
    },

    // ── Action button ─────────────────────────────────────────────────────────
    actionBtn: {
        marginTop: '20px',
        padding: '12px',
        width: '100%',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-bold)',
    },

    // ── Form (ForgetPopup) ────────────────────────────────────────────────────
    formRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '8px',
    },
    formInput: {
        padding: '10px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-input-bg)',
        border: '1px solid var(--color-input-border)',
        fontSize: 'var(--font-size-md)',
        outline: 'none',
        flex: 1,
        color: 'var(--color-text-near-black)',
    },
    formInputFull: {
        padding: '10px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-input-bg)',
        border: '1px solid var(--color-input-border)',
        fontSize: 'var(--font-size-md)',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        color: 'var(--color-text-near-black)',
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
