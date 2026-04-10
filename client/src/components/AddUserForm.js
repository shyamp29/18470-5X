import { useState } from 'react';
import { apiJoinProject } from '../Auth/apiCalls';
import UserProfileStyle from '../AppStyle/userProfile';
import ProjectInfoStyle from '../AppStyle/projectInfo';

const AddUserForm = ({ projectid, onSuccess, onError }) => {
    const [newUserId, setNewUserId] = useState('');

    const handleAddUser = async () => {
        if (!newUserId.trim()) return;
        const res = await apiJoinProject(projectid, newUserId.trim());
        if (res.status === 200) {
            onSuccess(`User "${newUserId.trim()}" added to project.`);
            setNewUserId('');
        } else {
            onError(res.message || "Failed to add user.");
        }
    };

    return (
        <div style={ProjectInfoStyle.addUserFormRow}>
            <input
                style={UserProfileStyle.selectInput}
                placeholder="Enter User ID"
                value={newUserId}
                onChange={e => setNewUserId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddUser()}
            />
            <button style={ProjectInfoStyle.smallBtn} onClick={handleAddUser}>Add</button>
        </div>
    );
};

export default AddUserForm;
