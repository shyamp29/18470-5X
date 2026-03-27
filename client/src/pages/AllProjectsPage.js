import {useEffect, useState} from "react";
import {apiFetchAllProjects, apiFetchUserProjects, apiJoinProject} from "../Auth/apiCalls.js";
// apiExitProject and apiDeleteProject excluded — buttons disabled until server implements these routes (TODO §8, §9)
import UserProfileStyle from "../AppStyle/userProfile.js";
import {SuccessPopup, ErrorPopup} from "../components/popupModular.js";

const sectionHeader = {
    fontSize: '17px',
    fontWeight: 'bold',
    marginTop: '24px',
    marginBottom: '8px',
    paddingBottom: '6px',
    borderBottom: '2px solid #c65c1a',
    color: '#333',
};

const AllProjectsPage = ({ userId, onBack }) => {
    const [allProjects, setAllProjects]   = useState([]);
    const [myProjectIDs, setMyProjectIDs] = useState(new Set());
    const [loading, setLoading]           = useState(true);
    const [joiningId, setJoiningId]       = useState(null);
    const [successMsg, setSuccessMsg] = useState({show: false, msg: ""});
    const [errorMsg, setErrorMsg]     = useState({show: false, msg: ""});

    const load = async () => {
        setLoading(true);
        const [allRes, myRes] = await Promise.all([
            apiFetchAllProjects(),
            apiFetchUserProjects(userId),
        ]);
        if (allRes.success) setAllProjects(allRes.data);
        if (myRes.success)  setMyProjectIDs(new Set(myRes.projects.map(p => p.projectId)));
        setLoading(false);
    };

    useEffect(() => { load(); }, [userId]);

    // handleExit and handleDelete removed — pending backend implementation (TODO §8, §9, §13)

    const handleJoin = async (projectID) => {
        setJoiningId(projectID);
        const res = await apiJoinProject({ projectID }, userId);
        if (res.success) {
            setMyProjectIDs(prev => new Set([...prev, projectID]));
            setSuccessMsg({show: true, msg: res.message});
        } else {
            setErrorMsg({show: true, msg: res.error || "Failed to join project."});
        }
        setJoiningId(null);
    };

    const myProjects      = allProjects.filter(p => myProjectIDs.has(p.projectId));
    const joinableProjects = allProjects.filter(p => !myProjectIDs.has(p.projectId));

    const renderMyProjectsTable = (projects) => (
        <table style={UserProfileStyle.table}>
            <thead>
            <tr>
                <th style={UserProfileStyle.th}>Project ID</th>
                <th style={UserProfileStyle.th}>Project Name</th>
                <th style={UserProfileStyle.th}>Description</th>
                <th style={UserProfileStyle.th}>Action</th>
            </tr>
            </thead>
            <tbody>
            {projects.length === 0 ? (
                <tr>
                    <td colSpan={4} style={{...UserProfileStyle.td, color: '#999', fontStyle: 'italic'}}>None</td>
                </tr>
            ) : projects.map((proj) => {
                const isOwner = proj.ownerUserId === userId;
                return (
                    <tr key={proj.projectId}>
                        <td style={UserProfileStyle.td}>{proj.projectId}</td>
                        <td style={UserProfileStyle.td}>{proj.name}</td>
                        <td style={UserProfileStyle.td}>{proj.description}</td>
                        <td style={UserProfileStyle.td}>
                            <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
                                {isOwner ? (
                                    // Delete — not yet implemented on server (TODO §8, §13)
                                    <button
                                        style={{...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 12px', backgroundColor: '#c0392b', color: '#fff', opacity: 0.4, cursor: 'not-allowed'}}
                                        disabled
                                        title="Not yet implemented — pending backend support"
                                    >
                                        Delete
                                    </button>
                                ) : (
                                    // Exit — not yet implemented on server (TODO §9, §13)
                                    <button
                                        style={{...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 12px', backgroundColor: '#7f8c8d', color: '#fff', opacity: 0.4, cursor: 'not-allowed'}}
                                        disabled
                                        title="Not yet implemented — pending backend support"
                                    >
                                        Leave
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );

    const renderJoinTable = (projects) => (
        <table style={UserProfileStyle.table}>
            <thead>
            <tr>
                <th style={UserProfileStyle.th}>Project ID</th>
                <th style={UserProfileStyle.th}>Project Name</th>
                <th style={UserProfileStyle.th}>Description</th>
                <th style={UserProfileStyle.th}>Action</th>
            </tr>
            </thead>
            <tbody>
            {projects.length === 0 ? (
                <tr>
                    <td colSpan={4} style={{...UserProfileStyle.td, color: '#999', fontStyle: 'italic'}}>None</td>
                </tr>
            ) : projects.map((proj) => (
                <tr key={proj.projectId}>
                    <td style={UserProfileStyle.td}>{proj.projectId}</td>
                    <td style={UserProfileStyle.td}>{proj.name}</td>
                    <td style={UserProfileStyle.td}>{proj.description}</td>
                    <td style={UserProfileStyle.td}>
                        <button
                            style={{...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 12px', backgroundColor: '#4a90d9', color: '#fff'}}
                            onClick={() => handleJoin(proj.projectId)}
                            disabled={joiningId === proj.projectId}
                        >
                            {joiningId === proj.projectId ? 'Joining...' : 'Join'}
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div style={UserProfileStyle.profileBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>All Projects</h2>

            {loading ? <p>Loading...</p> : (
                <>
                    <div style={sectionHeader}>My Projects</div>
                    {renderMyProjectsTable(myProjects)}

                    <div style={sectionHeader}>All Public Projects</div>
                    {renderJoinTable(joinableProjects)}
                </>
            )}
        <SuccessPopup
            showPopup={successMsg.show}
            message={successMsg.msg}
            onClose={() => setSuccessMsg({show: false, msg: ""})}
        />
        <ErrorPopup
            showPopup={errorMsg.show}
            message={errorMsg.msg}
            closePopup={() => setErrorMsg({show: false, msg: ""})}
        />
        </div>
    );
};
export default AllProjectsPage;
