import { useState, useRef, useEffect } from "react";
import useProjectData from "../hooks/useProjectData";
import useHardwareOps from "../hooks/useHardwareOps";
import AddUserForm from "../components/AddUserForm";
import UserProfileStyle from "../AppStyle/userProfile.js";
import ProjectInfoStyle from "../AppStyle/projectInfo.js";
import '../styles/global.css';
import { ErrorPopup } from "../components/popups";
import { apiLeaveProject, apiDeleteProject } from "../Auth/apiCalls";

const ProjectInfoPage = ({ projectid, userid, onBack }) => {
    const [successMessages, setSuccessMessages] = useState([]);
    const [errorMsg, setErrorMsg] = useState({ show: false, msg: "" });
    const [addingUser, setAddingUser] = useState(false);

    const showSuccess = (msgs) => {
        const lines = Array.isArray(msgs) ? msgs : String(msgs).split(' | ').map(s => s.trim()).filter(Boolean);
        const timestamp = new Date().toLocaleTimeString();
        const createdat = Date.now();
        const newMessages = lines.map(line => ({ text: line, timestamp, id: Date.now() + Math.random(), createdat }));

        setSuccessMessages(prev => {
            const updated = [...newMessages, ...prev];
            // Keep only the last 20 messages to prevent infinite growth
            return updated.slice(0, 5);
        });
        setErrorMsg({ show: false, msg: "" });
    };
    const showError = (msg) => {
        setSuccessMessages([]);
        setErrorMsg({ show: true, msg });
    };

    // Auto-remove messages after 1 minute
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setSuccessMessages(prev => prev.filter(msg => now - msg.createdat < 60000)); // 60 seconds
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const [actionBusy, setActionBusy] = useState(false);
    const { data, loading, qtys, handleQtyChange, reload, setData } = useProjectData(projectid);
    const { busy, handleCheckout, handleCheckin } = useHardwareOps(
        data, qtys, reload, showSuccess, showError, setData
    );
    const isOwner = data && data.owneruserid === userid;

    const handleLeaveOrDelete = async () => {
        const action = isOwner ? 'delete' : 'leave';
        const confirmed = window.confirm(
            isOwner
                ? `Delete project "${data.name}"? This will check in all hardware and remove it for all members.`
                : `Leave project "${data.name}"?`
        );
        if (!confirmed) return;
        setActionBusy(true);
        try {
            const res = isOwner
                ? await apiDeleteProject(projectid)
                : await apiLeaveProject(projectid);
            if (res.status === 200) {
                onBack();
            } else {
                showError(res.message || `Failed to ${action} project.`);
            }
        } catch {
            showError(`An unexpected error occurred while trying to ${action} the project.`);
        } finally {
            setActionBusy(false);
        }
    };

    return (
        <div style={ProjectInfoStyle.pageBox}>
            <div style={ProjectInfoStyle.headerRow}>
                <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
                {data && (
                    <button
                        className={`btn-action ${isOwner ? 'btn-action--danger' : 'btn-action--neutral'}`}
                        onClick={handleLeaveOrDelete}
                        disabled={actionBusy || busy}
                    >
                        {isOwner ? 'Delete Project' : 'Leave Project'}
                    </button>
                )}
            </div>
            <h2 style={UserProfileStyle.pageHeading}>Project Info</h2>

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
                        {isOwner && <span style={ProjectInfoStyle.ownerBadge}>(You)</span>}
                    </p>
                    <div style={ProjectInfoStyle.membersRow}>
                        <p className="m-0">
                            <strong>Members:</strong>{' '}
                            {(data.members ?? []).join(', ') || 'None'}
                        </p>
                        {isOwner && (
                            <button
                                onClick={() => setAddingUser(v => !v)}
                                style={ProjectInfoStyle.addUserBtn}
                                title="Add user to project"
                            >+</button>
                        )}
                    </div>
                    {addingUser && (
                        <AddUserForm
                            projectid={projectid}
                            onSuccess={(msg) => { showSuccess(msg); setAddingUser(false); reload(); }}
                            onError={showError}
                        />
                    )}

                    <table style={ProjectInfoStyle.hwTable}>
                        <thead>
                            <tr>
                                <th style={UserProfileStyle.th}>HW Set</th>
                                <th style={UserProfileStyle.th}>Capacity</th>
                                <th style={UserProfileStyle.th}>Available</th>
                                <th style={UserProfileStyle.th}>Allocated</th>
                                <th style={UserProfileStyle.th}>Qty</th>
                                <th style={UserProfileStyle.th}>Actions</th>
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
                                            value={qtys[idx] || ""}
                                            placeholder="0"
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => handleQtyChange(idx, e.target.value)}
                                            style={ProjectInfoStyle.hwQtyInput}
                                            disabled={busy}
                                        />
                                    </td>
                                    <td style={UserProfileStyle.td}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                style={ProjectInfoStyle.checkinBtn}
                                                onClick={() => handleCheckin(idx)}
                                                disabled={busy}
                                            >
                                                Check In
                                            </button>
                                            <button
                                                style={ProjectInfoStyle.checkoutBtn}
                                                onClick={() => handleCheckout(idx)}
                                                disabled={busy}
                                            >
                                                Check Out
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </>
            )}

            {successMessages.length > 0 && (
                <div
                    className="activity-log-scroll"
                    style={{
                        marginTop: '12px',
                        maxHeight: '50px',
                        overflowY: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {successMessages.map((message) => (
                            <div
                                key={message.id}
                                className="slide-in"
                                style={{
                                    fontSize: '14px',
                                    fontStyle: 'italic',
                                }}
                            >
                                <div style={{ color: '#2e7d32', fontWeight: '500' }}>
                                    {message.text}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                    {message.timestamp}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ErrorPopup
                showPopup={errorMsg.show}
                message={errorMsg.msg}
                onClose={() => setErrorMsg({ show: false, msg: "" })}
            />
        </div>
    );
};

export default ProjectInfoPage;
