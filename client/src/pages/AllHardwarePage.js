import { useEffect, useState } from "react";
import { apiFetchAllHardware } from "../Auth/apiCalls.js";
import '../styles/AllHardwarePage.css';

const AllHardwarePage = ({ onBack }) => {
    const [data, setData]           = useState(null);
    const [loading, setLoading]     = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);

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
                data.map((hw, index) => (
                    <div key={hw.setname ?? index} className="project-card hw-set-item">
                        <div
                            className="hw-set-toggle"
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                            <span className="project-card-name">{hw.setname}</span>
                            <span className="hw-chevron">{expandedIndex === index ? '▲' : '▼'}</span>
                        </div>

                        {expandedIndex === index && (
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
