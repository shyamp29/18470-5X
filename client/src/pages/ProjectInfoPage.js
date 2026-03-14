import React, {useEffect, useState} from "react";
import {mockFetchProjectInfo} from "../Auth/serverSimulation.js";
import UserProfileStyle from "../AppStyle/userProfile.js";

const ProjectInfoPage = ({ projectId, onBack }) => {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockFetchProjectInfo(projectId).then((res) => {
            if (res.success) setData(res.data);
            setLoading(false);
        });
    }, [projectId]);

    return (
        <div style={UserProfileStyle.profileBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Project Info</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Failed to load project info.</p>
            ) : (
                <>
                    <p><strong>Project Name:</strong> {data.projectName}</p>
                    <p><strong>Description:</strong> {data.description}</p>

                    <table style={{ ...UserProfileStyle.table, marginTop: '20px' }}>
                        <thead>
                        <tr>
                            <th style={UserProfileStyle.th}>HW</th>
                            <th style={UserProfileStyle.th}>Capacity</th>
                            <th style={UserProfileStyle.th}>Available</th>
                            <th style={UserProfileStyle.th}>Allocated</th>
                            <th style={UserProfileStyle.th}>Request</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.hardware.map((hw, idx) => (
                            <tr key={idx}>
                                <td style={UserProfileStyle.td}><strong>{hw.name}</strong></td>
                                <td style={UserProfileStyle.td}>{hw.capacity}</td>
                                <td style={UserProfileStyle.td}>{hw.available}</td>
                                <td style={UserProfileStyle.td}>{hw.allocated}</td>
                                <td style={UserProfileStyle.td}>
                                    <input
                                        type="number"
                                        min="0"
                                        max={hw.available}
                                        style={{ width: '60px', padding: '5px' }}
                                        placeholder="0"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ textAlign: 'right', marginTop: '15px' }}>
                        <button style={UserProfileStyle.submitBtn}>Submit</button>
                    </div>
                </>
            )}
        </div>
    );
};
export default ProjectInfoPage;
