import UserProfileStyle from './userProfile';

const ProjectInfoStyle = {
    pageBox: {
        ...UserProfileStyle.profileBox,
        maxWidth: '800px',
        width: '90%',
        margin: '60px auto',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // Delete / Leave button — always disabled; caller spreads backgroundColor dynamically
    disabledActionBtn: {
        ...UserProfileStyle.submitBtn,
        fontSize: '13px',
        padding: '6px 14px',
        color: '#fff',
        opacity: 0.4,
        cursor: 'not-allowed',
    },
    ownerBadge: {
        color: '#5b9bd5',
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
        border: '1px solid #c65c1a',
        borderRadius: '50%',
        width: '22px',
        height: '22px',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#c65c1a',
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
    },
    actionRow: {
        display: 'flex',
        gap: '16px',
        marginTop: '20px',
        justifyContent: 'flex-end',
    },
    checkinBtn: {
        ...UserProfileStyle.submitBtn,
        fontSize: '14px',
        backgroundColor: '#4a90d9',
        color: '#fff',
    },
    checkoutBtn: {
        ...UserProfileStyle.submitBtn,
        fontSize: '14px',
    },
    smallBtn: {
        ...UserProfileStyle.submitBtn,
        fontSize: '13px',
        padding: '6px 14px',
    },
};

export default ProjectInfoStyle;
