import { useState, useEffect, useCallback } from 'react';
import { apiFetchProjectInfo, apiFetchAllHardware } from '../Auth/apiCalls';

const useProjectData = (projectId) => {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [qtys, setQtys]       = useState([]);

    const load = useCallback(async () => {
        setLoading(true);
        const [projRes, hwRes] = await Promise.all([
            apiFetchProjectInfo(projectId),
            apiFetchAllHardware(),
        ]);
        if (projRes.status === 200) {
            const project    = projRes.project;
            const checkedout = project.checkedout ?? {};
            const hardware   = (hwRes.hardwaresets ?? []).map(hw => ({
                setname:      hw.setname,
                capacity:     hw.capacity,
                availability: hw.availability,
                allocated:    checkedout[hw.setname.toLowerCase()] ?? 0,
            }));
            setData({ ...project, hardware });
            setQtys(hardware.map(() => 0));
        }
        setLoading(false);
    }, [projectId]);

    useEffect(() => { load(); }, [load]);

    const handleQtyChange = (idx, value) => {
        setQtys(prev => prev.map((q, i) => i === idx ? Math.max(0, Number(value)) : q));
    };

    return { data, loading, qtys, handleQtyChange, reload: load };
};

export default useProjectData;
