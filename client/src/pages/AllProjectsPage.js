import React, {useEffect, useState} from "react";
import {mockFetchAllProjects, mockFetchUserProjects, mockJoinProject, mockExitProject, mockDeleteProject} from "../Auth/serverSimulation.js";
import UserProfileStyle from "../AppStyle/userProfile.js";

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
    const [actionId, setActionId]         = useState(null);

    const load = async () => {
        setLoading(true);
        const [allRes, myRes] = await Promise.all([
            mockFetchAllProjects(),
            mockFetchUserProjects(userId),
        ]);
        if (allRes.success) setAllProjects(allRes.data);
        if (myRes.success)  setMyProjectIDs(new Set(myRes.projects.map(p => p.projectId)));
        setLoading(false);
    };

    useEffect(() => { load(); }, [userId]);

    const handleExit = async (projectId) => {
        if (!window.confirm("Are you sure you want to exit this project?")) return;
        setActionId(projectId);
        const res = await mockExitProject({ projectID: projectId }, userId);
        if (res.success) {
            setMyProjectIDs(prev => { const s = new Set(prev); s.delete(projectId); return s; });
            alert(res.message);
        } else {
            alert(res.error || "Failed to exit project.");
        }
        setActionId(null);
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
        setActionId(projectId);
        const res = await mockDeleteProject({ projectID: projectId }, userId);
        if (res.success) {
            setMyProjectIDs(prev => { const s = new Set(prev); s.delete(projectId); return s; });
            setAllProjects(prev => prev.filter(p => p.projectId !== projectId));
            alert(res.message);
        } else {
            alert(res.error || "Failed to delete project.");
        }
        setActionId(null);
    };

    const handleJoin = async (projectID) => {
        setJoiningId(projectID);
        const res = await mockJoinProject({ projectID }, userId);
        if (res.success) {
            setMyProjectIDs(prev => new Set([...prev, projectID]));
            alert(res.message);
        } else {
            alert(res.error || "Failed to join project.");
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
                                    <button
                                        style={{...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 12px', backgroundColor: '#c0392b', color: '#fff'}}
                                        onClick={() => handleDelete(proj.projectId)}
                                        disabled={actionId === proj.projectId}
                                    >
                                        {actionId === proj.projectId ? 'Deleting...' : 'Delete'}
                                    </button>
                                ) : (
                                    <button
                                        style={{...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 12px', backgroundColor: '#7f8c8d', color: '#fff'}}
                                        onClick={() => handleExit(proj.projectId)}
                                        disabled={actionId === proj.projectId}
                                    >
                                        {actionId === proj.projectId ? 'Exiting...' : 'Exit Project'}
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
        </div>
    );
};
export default AllProjectsPage;
