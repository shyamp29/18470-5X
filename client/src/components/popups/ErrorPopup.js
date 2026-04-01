import PopupStyles from '../../AppStyle/popup';

const ErrorPopup = ({ showPopup, message, onClose }) => {
    if (!showPopup) return null;

    const handleOverlayClick = (e) => {
        if (e.target.id === 'error-popup-overlay') onClose();
    };

    return (
        <div id="error-popup-overlay" onClick={handleOverlayClick} style={PopupStyles.overlay}>
            <div style={PopupStyles.content}>
                <button onClick={onClose} style={PopupStyles.closeBtn}>&times;</button>
                <div style={PopupStyles.bodyPadding}>
                    <p style={PopupStyles.bodyText}>{message}</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopup;
