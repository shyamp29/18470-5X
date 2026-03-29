import {useEffect, useState} from "react";
import {apiFetchAllHardware} from "../Auth/apiCalls.js";
import UserProfileStyle from "../AppStyle/userProfile.js";

const AllHardwarePage = ({onBack}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
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
            <h2 style={{textAlign: 'center', textDecoration: 'underline'}}>All Hardware List</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Failed to load hardware.</p>
            ) : (
                data.map((hw) => (
                    <div key={hw.setname} style={{marginBottom: '10px'}}>
                        <h4
                            style={{cursor: 'pointer', textDecoration: 'underline', color: '#000'}}
                            onClick={() => setExpandedId(expandedId === hw.setname ? null : hw.setname)}
                        >
                            {hw.setname} {expandedId === hw.setname ? '▲' : '▼'}
                        </h4>

                        {expandedId === hw.setname && (
                            <table style={{...UserProfileStyle.table, width: '70%', marginLeft: '20px'}}>
                                <tbody>
                                <tr>
                                    <th style={{...UserProfileStyle.th, width: '50%'}}>Capacity</th>
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
