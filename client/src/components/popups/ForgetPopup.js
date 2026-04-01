import { useState } from 'react';
import PopupStyles from '../../AppStyle/popup';

const EMPTY_FIELDS = { userId: "", userName: "", newPassword: "" };

const ForgetPopup = ({ showPopup, onClose, onSubmit }) => {
    const [fields, setFields] = useState(EMPTY_FIELDS);

    if (!showPopup) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(fields);
        setFields(EMPTY_FIELDS);
    };

    const isReady = fields.userId.trim() && fields.userName.trim() && fields.newPassword.trim();

    return (
        <div style={PopupStyles.overlay}>
            <div style={PopupStyles.content}>
                <button onClick={onClose} style={PopupStyles.closeBtn}>&times;</button>
                <h2 style={PopupStyles.title}>Forgot Password</h2>
                <div style={PopupStyles.formRow}>
                    <input
                        type="text"
                        name="userId"
                        placeholder="User ID"
                        value={fields.userId}
                        onChange={handleChange}
                        style={PopupStyles.formInput}
                    />
                    <input
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={fields.userName}
                        onChange={handleChange}
                        style={PopupStyles.formInput}
                    />
                </div>
                <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={fields.newPassword}
                    onChange={handleChange}
                    style={PopupStyles.formInputFull}
                />
                <div style={PopupStyles.spacer} />
                <button onClick={handleSubmit} disabled={!isReady} style={PopupStyles.actionBtn}>
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default ForgetPopup;
