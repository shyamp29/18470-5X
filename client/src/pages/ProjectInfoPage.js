import React, { useState } from "react";
import useProjectData from "../hooks/useProjectData";
import useHardwareOps from "../hooks/useHardwareOps";
import AddUserForm from "../components/AddUserForm";
import UserProfileStyle from "../AppStyle/userProfile.js";
import { SuccessPopup, ErrorPopup } from "../components/popupModular.js";

const pageBox = {
    ...UserProfileStyle.profileBox,
    maxWidth: '800px',
    width: '90%',
    margin: '60px auto',
};

const ProjectInfoPage = ({ projectId, userId, onBack }) => {
    const [successMsg, setSuccessMsg] = useState({ show: false, msg: "" });
    const [errorMsg,   setErrorMsg]   = useState({ show: false, msg: "" });
    const [addingUser, setAddingUser] = useState(false);

    const showSuccess = (msg) => setSuccessMsg({ show: true, msg });
    const showError   = (msg) => setErrorMsg({ show: true, msg });

    const { data, loading, qtys, handleQtyChange, reload } = useProjectData(projectId);
    const { busy, handleCheckoutAll, handleCheckinAll }     = useHardwareOps(
        data, qtys, reload, showSuccess, showError
    );

    const isOwner = data && data.owneruserid === userId;

    return (
        <div style={pageBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
                {data && (
                    <button
                        style={{ ...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 14px',
                            backgroundColor: isOwner ? '#c0392b' : '#7f8c8d', color: '#fff',
                            opacity: 0.4, cursor: 'not-allowed' }}
                        disabled
                        title="Not yet implemented — pending backend support"
                    >
                        {isOwner ? 'Delete Project' : 'Leave Project'}
                    </button>
                )}
            </div>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Project Info</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Failed to load project info.</p>
            ) : (
                <>
                    <p><strong>Project ID:</strong> {data.projectid}</p>
                    <p><strong>Project Name:</strong> {data.name}</p>
                    <p><strong>Description:</strong> {data.description}</p>
                    <p>
                        <strong>Project Owner:</strong>{' '}
                        {data.ownerusername ?? data.owneruserid}
                        {isOwner && <span style={{ color: '#5b9bd5', marginLeft: '6px' }}>(You)</span>}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <p style={{ margin: 0 }}>
                            <strong>Members:</strong>{' '}
                            {(data.members ?? []).join(', ') || 'None'}
                        </p>
                        {isOwner && (
                            <button
                                onClick={() => setAddingUser(v => !v)}
                                style={{ background: 'none', border: '1px solid #c65c1a', borderRadius: '50%',
                                    width: '22px', height: '22px', cursor: 'pointer', fontSize: '16px',
                                    color: '#c65c1a', lineHeight: '1', padding: 0 }}
                                title="Add user to project"
                            >+</button>
                        )}
                    </div>
                    {addingUser && (
                        <AddUserForm
                            projectId={projectId}
                            onSuccess={(msg) => { showSuccess(msg); setAddingUser(false); reload(); }}
                            onError={showError}
                        />
                    )}

                    <table style={{ ...UserProfileStyle.table, marginTop: '20px' }}>
                        <thead>
                        <tr>
                            <th style={UserProfileStyle.th}>HW Set</th>
                            <th style={UserProfileStyle.th}>Capacity</th>
                            <th style={UserProfileStyle.th}>Available</th>
                            <th style={UserProfileStyle.th}>Allocated</th>
                            <th style={UserProfileStyle.th}>Qty</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.hardware.map((hw, idx) => (
                            <tr key={idx}>
                                <td style={UserProfileStyle.td}><strong>{hw.setname}</strong></td>
                                <td style={UserProfileStyle.td}>{hw.capacity}</td>
                                <td style={UserProfileStyle.td}>{hw.availability}</td>
                                <td style={UserProfileStyle.td}>{hw.allocated}</td>
                                <td style={UserProfileStyle.td}>
                                    <input
                                        type="number"
                                        min="0"
                                        value={qtys[idx] ?? 0}
                                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                                        style={{ width: '70px', padding: '5px', textAlign: 'center' }}
                                        disabled={busy}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button
                            style={{ ...UserProfileStyle.submitBtn, fontSize: '14px', backgroundColor: '#4a90d9', color: '#fff' }}
                            onClick={handleCheckinAll}
                            disabled={busy}
                        >
                            Check In
                        </button>
                        <button
                            style={{ ...UserProfileStyle.submitBtn, fontSize: '14px' }}
                            onClick={handleCheckoutAll}
                            disabled={busy}
                        >
                            Check Out
                        </button>
                    </div>
                </>
            )}

            <SuccessPopup
                showPopup={successMsg.show}
                message={successMsg.msg}
                onClose={() => setSuccessMsg({ show: false, msg: "" })}
            />
            <ErrorPopup
                showPopup={errorMsg.show}
                message={errorMsg.msg}
                closePopup={() => setErrorMsg({ show: false, msg: "" })}
            />
        </div>
    );
};

export default ProjectInfoPage;
