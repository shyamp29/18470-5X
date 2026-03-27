import React, {useEffect, useState} from "react";
import {mockFetchProjectInfo, mockCheckout, mockCheckin} from "../Auth/serverSimulation.js";
import UserProfileStyle from "../AppStyle/userProfile.js";

const pageBox = {
    ...UserProfileStyle.profileBox,
    maxWidth: '800px',
    width: '90%',
    margin: '60px auto',
};

const ProjectInfoPage = ({ projectId, userId, onBack }) => {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [qtys, setQtys]       = useState([]);
    const [busy, setBusy]       = useState(false);

    const loadProject = () => {
        setLoading(true);
        mockFetchProjectInfo(projectId).then((res) => {
            if (res.success) {
                setData(res.data);
                setQtys(res.data.hardware.map(() => 0));
            }
            setLoading(false);
        });
    };

    useEffect(() => { loadProject(); }, [projectId]);

    const handleQtyChange = (idx, value) => {
        setQtys(prev => prev.map((q, i) => i === idx ? Math.max(0, Number(value)) : q));
    };

    const handleCheckoutAll = async () => {
        const entries = data.hardware
            .map((hw, idx) => ({ setName: hw.setName, qty: qtys[idx] }))
            .filter(e => e.qty > 0);
        if (entries.length === 0) { alert("Enter a quantity greater than 0 for at least one HW Set."); return; }
        setBusy(true);
        for (const { setName, qty } of entries) {
            const res = await mockCheckout({ projectID: projectId, setName, qty });
            if (!res.success) { alert(`Check Out failed for ${setName}: ${res.error || "Unknown error."}`); }
        }
        setBusy(false);
        loadProject();
    };

    const handleCheckinAll = async () => {
        const entries = data.hardware
            .map((hw, idx) => ({ setName: hw.setName, qty: qtys[idx] }))
            .filter(e => e.qty > 0);
        if (entries.length === 0) { alert("Enter a quantity greater than 0 for at least one HW Set."); return; }
        setBusy(true);
        for (const { setName, qty } of entries) {
            const res = await mockCheckin({ projectID: projectId, setName, qty });
            if (!res.success) { alert(`Check In failed for ${setName}: ${res.error || "Unknown error."}`); }
        }
        setBusy(false);
        loadProject();
    };

    return (
        <div style={pageBox}>
            <button style={UserProfileStyle.backBtnStyle} onClick={onBack}>← Back</button>
            <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Project Info</h2>

            {loading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Failed to load project info.</p>
            ) : (
                <>
                    <p><strong>Project ID:</strong> {data.projectId}</p>
                    <p><strong>Project Name:</strong> {data.name}</p>
                    <p><strong>Description:</strong> {data.description}</p>

                    <table style={{ ...UserProfileStyle.table, marginTop: '20px' }}>
                        <thead>
                        <tr>
                            <th style={UserProfileStyle.th}>HW Set</th>
                            <th style={UserProfileStyle.th}>Capacity</th>
                            <th style={UserProfileStyle.th}>Available</th>
                            <th style={UserProfileStyle.th}>Allocated</th>
                            <th style={UserProfileStyle.th}>Qty</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.hardware.map((hw, idx) => (
                            <tr key={idx}>
                                <td style={UserProfileStyle.td}><strong>{hw.setName}</strong></td>
                                <td style={UserProfileStyle.td}>{hw.capacity}</td>
                                <td style={UserProfileStyle.td}>{hw.availability}</td>
                                <td style={UserProfileStyle.td}>{hw.allocated}</td>
                                <td style={UserProfileStyle.td}>
                                    <input
                                        type="number"
                                        min="0"
                                        value={qtys[idx] ?? 0}
                                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                                        style={{ width: '70px', padding: '5px', textAlign: 'center' }}
                                        disabled={busy}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button
                            style={{ ...UserProfileStyle.submitBtn, fontSize: '14px' }}
                            onClick={handleCheckoutAll}
                            disabled={busy}
                        >
                            Check Out
                        </button>
                        <button
                            style={{ ...UserProfileStyle.submitBtn, fontSize: '14px', backgroundColor: '#4a90d9', color: '#fff' }}
                            onClick={handleCheckinAll}
                            disabled={busy}
                        >
                            Check In
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
export default ProjectInfoPage;
