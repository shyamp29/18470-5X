import React, {useEffect, useState} from "react";
import {mockFetchAllProjects} from "../Auth/serverSimulation.js";
import UserProfileStyle from "../AppStyle/userProfile.js";

const AllProjectsPage = ({ onBack }) => {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockFetchAllProjects().then((res) => {
            if (res.success) setData(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <div style={UserProfileStyle.profileBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>All Projects List</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Failed to load projects.</p>
            ) : (
                <>
                    <table style={UserProfileStyle.table}>
                        <thead>
                        <tr>
                            <th style={UserProfileStyle.th}>Project ID</th>
                            <th style={UserProfileStyle.th}>Project Name</th>
                            <th style={UserProfileStyle.th}>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((proj, idx) => (
                            <tr key={idx}>
                                <td style={UserProfileStyle.td}>{proj.projectId}</td>
                                <td style={UserProfileStyle.td}>{proj.projectName}</td>
                                <td style={UserProfileStyle.td}>{proj.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Total HW Usage:</h3>
                        <p>HW Set 1: XXX</p>
                        <p>HW Set 2: YYY</p>
                    </div>
                </>
            )}
        </div>
    );
};
export default AllProjectsPage;
