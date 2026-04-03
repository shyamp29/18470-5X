export const brand = {
    appName:    '5X Haas Portal',
    logoPath:   null,
    fontFamily: 'Arial, sans-serif',
};

export const colors = {
    primary:        '#2563eb',

    danger:         '#c0392b',
    checkin:        '#4a90d9',
    link:           '#2563eb',
    menuLink:       '#60a5fa',
    ownerBadge:     '#5b9bd5',
    disabled:       '#7f8c8d',

    pageBg:         '#eff6ff',
    cardBg:         '#ffffff',
    tableHeaderBg:  '#f0f7ff',
    inputBg:        '#f1f5f9',
    inputBorder:    '#cbd5e1',

    textPrimary:    '#333333',
    textDark:       '#1e3a5f',
    textNearBlack:  '#121111',
    textMuted:      '#999999',
    textOnDark:     '#888888',

    borderStrong:   '#aaaaaa',
    border:         '#cccccc',
    borderLight:    '#dddddd',
    borderLighter:  '#eeeeee',

    overlayLight:   'rgba(0, 0, 0, 0.5)',
    overlayDark:    'rgba(0, 0, 0, 0.7)',
};

export const typography = {
    fontFamily: 'Arial, sans-serif',

    fontSizeXs:   '12px',
    fontSizeSm:   '13px',
    fontSizeMd:   '14px',
    fontSizeBase: '15px',
    fontSizeLg:   '16px',
    fontSizeXl:   '18px',
    fontSize2xl:  '20px',
    fontSize3xl:  '24px',
    fontSize4xl:  '28px',

    fontWeightNormal: 'normal',
    fontWeightBold:   'bold',
};

export const shape = {
    radiusSm:    '4px',
    radiusMd:    '6px',
    radiusLg:    '8px',
    radiusXl:    '12px',
    radiusRound: '50%',
};

export const shadows = {
    card:       '0 4px 15px rgba(0, 0, 0, 0.1)',
    popup:      '0 4px 15px rgba(0, 0, 0, 0.3)',
    popupLarge: '0 4px 20px rgba(0, 0, 0, 0.2)',
    loginCard:  '0 8px 20px rgba(37, 99, 235, 0.35)',
};

export const trim = {
    color:  colors.primary,
    height: '40px',
};

const Theme = { brand, colors, typography, shape, shadows, trim };
export default Theme;