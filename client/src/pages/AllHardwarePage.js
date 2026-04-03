import { useEffect, useState } from "react";
import { apiFetchAllHardware } from "../Auth/apiCalls.js";
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
        <>
            <button className="back-btn-filled" onClick={onBack}>← Back to Home</button>
            <h2 className="projects-page-title">ALL HARDWARE</h2>

            {loading ? (
                <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
            ) : !data ? (
                <p style={{ color: 'var(--color-text-muted)' }}>Failed to load hardware.</p>
            ) : (
                data.map((hw) => (
                    <div key={hw.setname} className="project-card hw-set-item">
                        <div
                            className="hw-set-toggle"
                            onClick={() => setExpandedId(expandedId === hw.setname ? null : hw.setname)}
                        >
                            <span className="project-card-name">{hw.setname}</span>
                            <span className="hw-chevron">{expandedId === hw.setname ? '▲' : '▼'}</span>
                        </div>

                        {expandedId === hw.setname && (
                            <table className="hw-detail-table">
                                <tbody>
                                <tr>
                                    <th className="hw-th">Capacity</th>
                                    <td className="hw-td">{hw.capacity}</td>
                                </tr>
                                <tr>
                                    <th className="hw-th">Availability</th>
                                    <td className="hw-td">{hw.availability}</td>
                                </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                ))
            )}
        </>
    );
};
export default AllHardwarePage;
