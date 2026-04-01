import { useState } from "react";
import useProjectData from "../hooks/useProjectData";
import useHardwareOps from "../hooks/useHardwareOps";
import AddUserForm from "../components/AddUserForm";
import UserProfileStyle from "../AppStyle/userProfile.js";
import ProjectInfoStyle from "../AppStyle/projectInfo.js";
import '../styles/global.css';
import { SuccessPopup, ErrorPopup } from "../components/popupModular.js";

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
        <div style={ProjectInfoStyle.pageBox}>
            <div style={ProjectInfoStyle.headerRow}>
                <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
                {data && (
                    <button
                        className={`btn-action ${isOwner ? 'btn-action--danger' : 'btn-action--neutral'}`}
                        disabled
                        title="Not yet implemented — pending backend support"
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
                            projectId={projectId}
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
                                        style={ProjectInfoStyle.hwQtyInput}
                                        disabled={busy}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={ProjectInfoStyle.actionRow}>
                        <button style={ProjectInfoStyle.checkinBtn}  onClick={handleCheckinAll}  disabled={busy}>Check In</button>
                        <button style={ProjectInfoStyle.checkoutBtn} onClick={handleCheckoutAll} disabled={busy}>Check Out</button>
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
                onClose={() => setErrorMsg({ show: false, msg: "" })}
            />
        </div>
    );
};

export default ProjectInfoPage;
