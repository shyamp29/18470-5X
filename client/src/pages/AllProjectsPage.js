import {useEffect, useState} from "react";
import {apiFetchUserProjects} from "../Auth/apiCalls.js";
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
    }, [userId]);

    return (
        <div style={UserProfileStyle.profileBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>All Projects</h2>

            {loading ? <p>Loading...</p> : (
                <>
                    <div style={sectionHeader}>My Projects</div>
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
                                <td colSpan={4} style={{...UserProfileStyle.td, color: '#999', fontStyle: 'italic'}}>None</td>
                            </tr>
                        ) : myProjects.map((proj) => {
                            const isOwner = proj.owneruserid === userId;
                            return (
                                <tr key={proj.projectid}>
                                    <td style={UserProfileStyle.td}>{proj.projectid}</td>
                                    <td style={UserProfileStyle.td}>{proj.name}</td>
                                    <td style={UserProfileStyle.td}>{proj.description}</td>
                                    <td style={UserProfileStyle.td}>
                                        {isOwner ? (
                                            <button
                                                style={{...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 12px', backgroundColor: '#c0392b', color: '#fff', opacity: 0.4, cursor: 'not-allowed'}}
                                                disabled
                                                title="Not yet implemented — pending backend support"
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <button
                                                style={{...UserProfileStyle.submitBtn, fontSize: '13px', padding: '6px 12px', backgroundColor: '#7f8c8d', color: '#fff', opacity: 0.4, cursor: 'not-allowed'}}
                                                disabled
                                                title="Not yet implemented — pending backend support"
                                            >
                                                Leave
                                            </button>
                                        )}
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
