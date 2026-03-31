import { useState } from 'react';
import { apiCheckout, apiCheckin } from '../Auth/apiCalls';

const useHardwareOps = (data, qtys, reload, onSuccess, onError) => {
    const [busy, setBusy] = useState(false);

    const handleCheckoutAll = async () => {
        const entries = (data?.hardware ?? [])
            .map((hw, idx) => ({ setName: hw.setname, qty: Math.min(qtys[idx], hw.availability) }))
            .filter(e => e.qty > 0);
        if (entries.length === 0) {
            onError("Enter a quantity greater than 0 for at least one HW Set.");
            return;
        }
        setBusy(true);
        const errors = [];
        for (const { setName, qty } of entries) {
            const res = await apiCheckout({ setName, qty });
            if (res.status !== 200) errors.push(`${setName}: ${res.message || "Unknown error."}`);
        }
        setBusy(false);
        reload();
        if (errors.length > 0) onError(`Check Out failed — ${errors.join(", ")}`);
        else onSuccess("Check Out successful!");
    };

    const handleCheckinAll = async () => {
        const entries = (data?.hardware ?? [])
            .map((hw, idx) => ({ setName: hw.setname, qty: Math.min(qtys[idx], hw.allocated) }))
            .filter(e => e.qty > 0);
        if (entries.length === 0) {
            onError("Enter a quantity greater than 0 for at least one HW Set.");
            return;
        }
        setBusy(true);
        const errors = [];
        for (const { setName, qty } of entries) {
            const res = await apiCheckin({ setName, qty });
            if (res.status !== 200 && res.status !== 206) errors.push(`${setName}: ${res.message || "Unknown error."}`);
        }
        setBusy(false);
        reload();
        if (errors.length > 0) onError(`Check In failed — ${errors.join(", ")}`);
        else onSuccess("Check In successful!");
    };

    return { busy, handleCheckoutAll, handleCheckinAll };
};

export default useHardwareOps;
