import PopupStyles from '../../AppStyle/popup';

const SuccessPopup = ({ showPopup, message, onClose, title = "Success", btnLabel = "Close" }) => {
    if (!showPopup) return null;

    return (
        <div style={PopupStyles.overlay}>
            <div style={PopupStyles.content}>
                <button onClick={onClose} style={PopupStyles.closeBtn}>&times;</button>
                <h2 style={PopupStyles.title}>{title}</h2>
                <p style={PopupStyles.description}>{message}</p>
                <button onClick={onClose} style={PopupStyles.actionBtn}>
                    {btnLabel}
                    <span style={PopupStyles.actionBtnArrow}>{"\u2192"}</span>
                </button>
            </div>
        </div>
    );
};

export default SuccessPopup;
