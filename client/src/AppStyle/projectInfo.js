import UserProfileStyle from './userProfile';

const ProjectInfoStyle = {
    pageBox: {
        ...UserProfileStyle.profileBox,
        maxWidth: '800px',
        width: '90%',
        margin: '60px auto',
        color: 'var(--color-text-primary)',
        maxHeight: 'calc(100vh - 2 * var(--trim-height) - 40px)',
        overflowY: 'auto',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ownerBadge: {
        color: 'var(--color-owner-badge)',
        marginLeft: '6px',
    },
    membersRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
    },
    addUserBtn: {
        background: 'none',
        border: '1px solid var(--color-primary)',
        borderRadius: 'var(--radius-round)',
        width: '22px',
        height: '22px',
        cursor: 'pointer',
        fontSize: 'var(--font-size-lg)',
        color: 'var(--color-primary)',
        lineHeight: '1',
        padding: 0,
    },
    addUserFormRow: {
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
    },
    hwTable: {
        ...UserProfileStyle.table,
        marginTop: '20px',
    },
    hwQtyInput: {
        width: '70px',
        padding: '5px',
        textAlign: 'center',
        backgroundColor: 'var(--color-input-bg)',
        border: '1px solid var(--color-input-border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-text-primary)',
    },
    actionRow: {
        display: 'flex',
        gap: '16px',
        marginTop: '20px',
        justifyContent: 'flex-end',
    },
    checkinBtn: {
        ...UserProfileStyle.submitBtn,
        fontSize: 'var(--font-size-md)',
        backgroundColor: 'var(--color-checkin)',
        color: '#fff',
    },
    checkoutBtn: {
        ...UserProfileStyle.submitBtn,
        fontSize: 'var(--font-size-md)',
    },
    smallBtn: {
        ...UserProfileStyle.submitBtn,
        fontSize: 'var(--font-size-sm)',
        padding: '6px 14px',
    },
};

export default ProjectInfoStyle;
