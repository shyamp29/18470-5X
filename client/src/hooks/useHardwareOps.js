import { useState } from 'react';
import { apiCheckout, apiCheckin } from '../Auth/apiCalls';

const useHardwareOps = (data, qtys, reload, onSuccess, onError, setData) => {
    const [busy, setBusy] = useState(false);

    const handleCheckoutAll = async () => {
        const entries = (data?.hardware ?? [])
            .map((hw, idx) => ({ setname: hw.setname, qty: Math.min(qtys[idx], hw.availability) }))
            .filter(e => e.qty > 0);
        if (entries.length === 0) {
            onError("Enter a quantity greater than 0 for at least one HW Set.");
            return;
        }
        setBusy(true);
        const errors = [];
        const results = [];

        for (const { setname, qty } of entries) {
            const res = await apiCheckout({ setname, qty });
            const checkedout = Number(res.checkedout ?? qty);
            if (res.status === 200) {
                results.push(`${setname} checked out ${checkedout}`);
            } else if (res.status === 206) {
                const notChecked = qty - checkedout;
                results.push(
                    `${setname} checked out ${checkedout}. Unable to check out ${notChecked}. ${res.message ?? ''}`.trim()
                );
            } else {
                const errMsg = res.message || "Unknown error.";
                errors.push(`${setname} checked out 0. Unable to check out ${qty}. ${errMsg}`);
            }
        }

        setBusy(false);
        reload();

        if (errors.length > 0) {
            onError(errors.join(' | '));
        } else {
            onSuccess(results);
        }
    };

    const handleCheckinAll = async () => {
        const entries = (data?.hardware ?? [])
            .map((hw, idx) => ({ setname: hw.setname, qty: Math.min(qtys[idx], hw.allocated) }))
            .filter(e => e.qty > 0);
        if (entries.length === 0) {
            onError("Checked in 0.");
            return;
        }
        setBusy(true);
        const errors = [];
        const results = [];

        for (const { setname, qty } of entries) {
            const res = await apiCheckin({ setname, qty });
            const checkedIn = Number(res.checkedin ?? qty);
            if (res.status === 200) {
                results.push(`${setname} checked in ${checkedIn}`);
            } else if (res.status === 206) {
                const notChecked = qty - checkedIn;
                results.push(
                    `${setname} checked in ${checkedIn}. Unable to check in ${notChecked}. ${res.message ?? ''}`.trim()
                );
            } else {
                const errMsg = res.message || "Unknown error.";
                errors.push(`${setname} checked in 0. Unable to check in ${qty}. ${errMsg}`);
            }
        }

        setBusy(false);
        reload();

        if (errors.length > 0) {
            onError(errors.join(' | '));
        } else {
            onSuccess(results);
        }
    };

    const handleCheckout = async (hwIndex) => {
        const hw = data?.hardware?.[hwIndex];
        const qty = Math.min(qtys[hwIndex] || 0, hw?.availability || 0);
        if (!hw || qty <= 0) {
            onError("No available hardware unit to check out.");
            return;
        }
        setBusy(true);
        const res = await apiCheckout({ setname: hw.setname, qty });
        const checkedout = Number(res.checkedout ?? qty);
        setBusy(false);

        // Update local data instead of reloading
        if (setData && data) {
            setData(prevData => ({
                ...prevData,
                hardware: prevData.hardware.map((h, idx) =>
                    idx === hwIndex
                        ? {
                            ...h,
                            availability: Number(res.availability ?? h.availability),
                            allocated: h.allocated + checkedout
                        }
                        : h
                )
            }));
        }

        if (res.status === 200) {
            onSuccess([`${hw.setname} checked out ${checkedout}`]);
        } else if (res.status === 206) {
            const notChecked = qty - checkedout;
            onSuccess([`${hw.setname} checked out ${checkedout}. Unable to check out ${notChecked}. ${res.message ?? ''}`.trim()]);
        } else {
            const errMsg = res.message || "Unknown error.";
            onError(`${hw.setname} checked out 0. Unable to check out ${qty}. ${errMsg}`);
        }
    };

    const handleCheckin = async (hwIndex) => {
        const hw = data?.hardware?.[hwIndex];
        const qty = Math.min(qtys[hwIndex] || 0, hw?.allocated || 0);
        if (!hw || qty <= 0) {
            onError("No available hardware unit to check in.");
            return;
        }
        setBusy(true);
        const res = await apiCheckin({ setname: hw.setname, qty });
        const checkedIn = Number(res.checkedin ?? qty);
        setBusy(false);

        // Update local data instead of reloading
        if (setData && data) {
            setData(prevData => ({
                ...prevData,
                hardware: prevData.hardware.map((h, idx) =>
                    idx === hwIndex
                        ? {
                            ...h,
                            availability: Number(res.availability ?? h.availability),
                            allocated: Math.max(0, h.allocated - checkedIn)
                        }
                        : h
                )
            }));
        }

        if (res.status === 200) {
            onSuccess([`${hw.setname} checked in ${checkedIn}`]);
        } else if (res.status === 206) {
            const notChecked = qty - checkedIn;
            onSuccess([`${hw.setname} checked in ${checkedIn}. Unable to check in ${notChecked}. ${res.message ?? ''}`.trim()]);
        } else {
            const errMsg = res.message || "Unknown error.";
            onError(`${hw.setname} checked in 0. Unable to check in ${qty}. ${errMsg}`);
        }
    };

    return { busy, handleCheckout, handleCheckin, handleCheckoutAll, handleCheckinAll };
};

export default useHardwareOps;
