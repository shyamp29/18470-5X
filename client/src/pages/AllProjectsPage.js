import { useEffect, useState } from "react";
import { apiFetchUserProjects, apiLeaveProject, apiDeleteProject } from "../Auth/apiCalls.js";
import '../styles/AllProjectsPage.css';

const AllProjectsPage = ({ userid, onBack }) => {
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionBusy, setActionBusy] = useState(null); // projectid currently being acted on

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await apiFetchUserProjects();
            if (res.status === 200) setMyProjects(res.projectslist ?? []);
            setLoading(false);
        };
        load();
    }, [userid]);

    const handleLeaveOrDelete = async (proj) => {
        const isOwner = proj.owneruserid === userid;
        const action = isOwner ? 'delete' : 'leave';
        const confirmed = window.confirm(
            isOwner
                ? `Delete project "${proj.name}"? This cannot be undone.`
                : `Leave project "${proj.name}"?`
        );
        if (!confirmed) return;
        setActionBusy(proj.projectid);
        try {
            const res = isOwner
                ? await apiDeleteProject(proj.projectid)
                : await apiLeaveProject(proj.projectid);
            if (res.status === 200) {
                setMyProjects(prev => prev.filter(p => p.projectid !== proj.projectid));
            } else {
                alert(res.message || `Failed to ${action} project.`);
            }
        } catch {
            alert(`An unexpected error occurred.`);
        } finally {
            setActionBusy(null);
        }
    };

    return (
        <>
            <button className="back-btn-filled" onClick={onBack}>← Back to Home</button>

            <h2 className="projects-page-title">
                MY PROJECTS
            </h2>

            {loading ? <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p> : (
                <>
                    {myProjects.length === 0 ? (
                        <p className="no-projects">No projects found.</p>
                    ) : myProjects.map((proj) => {
                        const isOwner = proj.owneruserid === userid;
                        return (
                            <div key={proj.projectid} className="project-card">
                                <div className="project-card-top">
                                    <div className="project-card-title-row">
                                        <span className="project-card-name">
                                            {proj.name} <span className="project-id">({proj.projectid})</span>
                                        </span>
                                    </div>
                                    <span className="badge-active">active</span>
                                </div>

                                <div className="project-card-body">
                                    <div className="project-card-details">
                                        <div className="project-field">
                                            <span className="field-label">Project Name:</span>
                                            <span className="field-value">{proj.name}</span>
                                        </div>
                                        <div className="project-field">
                                            <span className="field-label">Description:</span>
                                            <span className="field-value">{proj.description || '—'}</span>
                                        </div>
                                    </div>

                                    <div className="project-card-action">
                                        <span className="field-label">Action</span>
                                        <button
                                            className={isOwner ? 'btn-delete-project' : 'btn-leave-project'}
                                            disabled={actionBusy === proj.projectid}
                                            onClick={() => handleLeaveOrDelete(proj)}
                                        >
                                            {actionBusy === proj.projectid
                                                ? (isOwner ? 'Deleting...' : 'Leaving...')
                                                : (isOwner ? '🗑 Delete Project' : '⇒ Leave Project')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </>
    );
};

export default AllProjectsPage;
