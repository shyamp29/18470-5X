import { useEffect, useState } from "react";
import { apiFetchUserProjects } from "../Auth/apiCalls.js";
import '../styles/AllProjectsPage.css';

const AllProjectsPage = ({ userid, onBack }) => {
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await apiFetchUserProjects();
            if (res.status === 200) setMyProjects(res.projectslist ?? []);
            setLoading(false);
        };
        load();
    }, [userid]);

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
                                            disabled
                                            title="Not yet implemented — pending backend support"
                                        >
                                            {isOwner ? '🗑 Delete Project' : '⇒ Leave Project'}
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
