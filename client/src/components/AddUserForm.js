import { useState } from 'react';
import { apiJoinProject } from '../Auth/apiCalls';
import UserProfileStyle from '../AppStyle/userProfile';

const AddUserForm = ({ projectId, onSuccess, onError }) => {
    const [newUserId, setNewUserId] = useState('');

    const handleAddUser = async () => {
        if (!newUserId.trim()) return;
        const res = await apiJoinProject(projectId, newUserId.trim());
        if (res.status === 200) {
            onSuccess(`User "${newUserId.trim()}" added to project.`);
            setNewUserId('');
        } else {
            onError(res.message || "Failed to add user.");
        }
    };

    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
                style={{ ...UserProfileStyle.selectInput, flex: 1 }}
                placeholder="Enter User ID"
                value={newUserId}
                onChange={e => setNewUserId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddUser()}
            />
            <button
                style={{ ...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 14px' }}
                onClick={handleAddUser}
            >
                Add
            </button>
        </div>
    );
};

export default AddUserForm;
