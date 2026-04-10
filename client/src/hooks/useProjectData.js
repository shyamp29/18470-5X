import { useState, useEffect, useCallback } from 'react';
import { apiFetchProjectInfo, apiFetchAllHardware } from '../Auth/apiCalls';
import socket from '../api/socket';

const useProjectData = (projectid) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qtys, setQtys] = useState([]);

    const load = useCallback(async () => {
        if (!projectid) return;
        setLoading(true);
        const [projRes, hwRes] = await Promise.all([
            apiFetchProjectInfo(projectid),
            apiFetchAllHardware(),
        ]);
        if (projRes.status === 200) {
            const project = projRes.project;
            const checkedout = project.checkedout ?? {};
            const hardware   = (hwRes.hardwaresets ?? [])
                .filter(hw => hw.setname != null)
                .map(hw => ({
                    setname:      hw.setname,
                    capacity:     hw.capacity,
                    availability: hw.availability,
                    allocated:    checkedout[hw.setname.toLowerCase()] ?? 0,
                }));
            setData({ ...project, hardware });
            setQtys(hardware.map(() => 0));
        }
        setLoading(false);
    }, [projectid]);

    useEffect(() => { load(); }, [load]);

    // Listen for server-pushed hardware updates and patch local state
    useEffect(() => {
        if (!projectid) return;

        const handleHardwareUpdate = ({ setname, availability }) => {
            setData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    hardware: prev.hardware.map(hw =>
                        hw.setname.toLowerCase() === setname.toLowerCase()
                            ? { ...hw, availability }
                            : hw
                    ),
                };
            });
        };

        socket.on('hardware_update', handleHardwareUpdate);
        return () => { socket.off('hardware_update', handleHardwareUpdate); };
    }, [projectid]);

    const handleQtyChange = (idx, value) => {
        setQtys(prev => prev.map((q, i) => i === idx ? Math.max(0, Number(value)) : q));
    };

    return { data, loading, qtys, handleQtyChange, reload: load, setData };
};

export default useProjectData;
