import { useEffect, useState } from "react";
import { apiFetchAllHardware } from "../Auth/apiCalls.js";
import UserProfileStyle from "../AppStyle/userProfile.js";
import '../styles/AllHardwarePage.css';

const AllHardwarePage = ({ onBack }) => {
    const [data, setData]           = useState(null);
    const [loading, setLoading]     = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        apiFetchAllHardware()
            .then((res) => {
                if (res.status === 200) setData(res.hardwaresets);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div style={UserProfileStyle.profileBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={UserProfileStyle.pageHeading}>All Hardware List</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Failed to load hardware.</p>
            ) : (
                data.map((hw) => (
                    <div key={hw.setname} className="hw-set-item">
                        <h4
                            className="hw-set-toggle"
                            onClick={() => setExpandedId(expandedId === hw.setname ? null : hw.setname)}
                        >
                            {hw.setname} {expandedId === hw.setname ? '▲' : '▼'}
                        </h4>

                        {expandedId === hw.setname && (
                            <table style={UserProfileStyle.table} className="hw-detail-table">
                                <tbody>
                                <tr>
                                    <th style={UserProfileStyle.th} className="col-half">Capacity</th>
                                    <td style={UserProfileStyle.td}>{hw.capacity}</td>
                                </tr>
                                <tr>
                                    <th style={UserProfileStyle.th}>Availability</th>
                                    <td style={UserProfileStyle.td}>{hw.availability}</td>
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
