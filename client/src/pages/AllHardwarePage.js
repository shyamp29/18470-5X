import React, {useEffect, useState} from "react";
import {mockFetchAllHardware} from "../Auth/serverSimulation.js";
import UserProfileStyle from "../AppStyle/userProfile.js";

const AllHardwarePage = ({ onBack }) => {
    const [data, setData]               = useState(null);
    const [loading, setLoading]         = useState(true);
    const [expandedId, setExpandedId]   = useState(null);

    useEffect(() => {
        mockFetchAllHardware().then((res) => {
            if (res.success) setData(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <div style={UserProfileStyle.profileBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>All Hardware List</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Failed to load hardware.</p>
            ) : (
                data.map((hw) => (
                    <div key={hw.id} style={{ marginBottom: '10px' }}>
                        <h4
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: '#000' }}
                            onClick={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                        >
                            {hw.name} {expandedId === hw.id ? '▲' : '▼'}
                        </h4>

                        {expandedId === hw.id && (
                            <table style={{ ...UserProfileStyle.table, width: '70%', marginLeft: '20px' }}>
                                <tbody>
                                <tr>
                                    <th style={{ ...UserProfileStyle.th, width: '50%' }}>Capacity</th>
                                    <td style={UserProfileStyle.td}>{hw.capacity}</td>
                                </tr>
                                <tr>
                                    <th style={UserProfileStyle.th}>Availability</th>
                                    <td style={UserProfileStyle.td}>{hw.available}</td>
                                </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};
export default AllHardwarePage;
