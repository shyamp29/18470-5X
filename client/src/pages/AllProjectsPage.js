import { useEffect, useState } from "react";
import { apiFetchUserProjects } from "../Auth/apiCalls.js";
import UserProfileStyle from "../AppStyle/userProfile.js";
import '../styles/AllProjectsPage.css';

const AllProjectsPage = ({ userid, onBack }) => {
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading]       = useState(true);

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
        <div style={UserProfileStyle.profileBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={UserProfileStyle.pageHeading}>All Projects</h2>

            {loading ? <p>Loading...</p> : (
                <>
                    <div className="section-header">My Projects</div>
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
                        {myProjects.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={UserProfileStyle.td} className="td-muted">None</td>
                            </tr>
                        ) : myProjects.map((proj) => {
                            const isOwner = proj.owneruserid === userid;
                            return (
                                <tr key={proj.projectid}>
                                    <td style={UserProfileStyle.td}>{proj.projectid}</td>
                                    <td style={UserProfileStyle.td}>{proj.name}</td>
                                    <td style={UserProfileStyle.td}>{proj.description}</td>
                                    <td style={UserProfileStyle.td}>
                                        <button
                                            className={`btn-action btn-action--sm ${isOwner ? 'btn-action--danger' : 'btn-action--neutral'}`}
                                            disabled
                                            title="Not yet implemented — pending backend support"
                                        >
                                            {isOwner ? 'Delete' : 'Leave'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};
export default AllProjectsPage;
