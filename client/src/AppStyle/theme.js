
// ── Brand / Logo ─────────────────────────────────────────────────────────────
export const brand = {
    appName:    '5X Haas Portal',    // TODO: replace with final product name
    logoPath:   null,                    // TODO: set to '/assets/logo.svg' once available
    fontFamily: 'Arial, sans-serif',
};

// ── Color palette ─────────────────────────────────────────────────────────────
export const colors = {

    // Primary — brand orange used for buttons, trims, borders, and shadows
    primary:        '#52e0d9',

    // Semantic actions
    danger:         '#c0392b',    // destructive actions (delete, remove)
    checkin:        '#4a90d9',    // check-in action button
    link:           '#3498db',    // inline / footer links
    menuLink:       '#6eb6ff',    // sidebar menu links
    ownerBadge:     '#5b9bd5',    // "owner" label / badge
    disabled:       '#7f8c8d',    // disabled state (buttons, leave action)

    // Surfaces
    pageBg:         '#f4f7f9',    // page / app background
    cardBg:         '#ffffff',    // white cards and modal boxes
    tableHeaderBg:  '#f9f9f9',   // table <th> fill
    inputBg:        '#eed2c0',    // form input background (warm cream)
    inputBorder:    '#dcbfae',    // form input border

    // Text
    textPrimary:    '#333333',    // default body text
    textDark:       '#2c3e50',    // headings, footer labels
    textNearBlack:  '#121111',    // high-contrast labels (login form)
    textMuted:      '#999999',    // placeholder / empty-state text
    textOnDark:     '#888888',    // icons / close button on white backgrounds

    // Borders & dividers
    borderStrong:   '#aaaaaa',    // back-button outline
    border:         '#cccccc',    // general input / card borders
    borderLight:    '#dddddd',    // nav bar divider
    borderLighter:  '#eeeeee',    // table row / dropdown item dividers

    // Overlays
    overlayLight:   'rgba(0, 0, 0, 0.5)',   // modal backdrop (lighter)
    overlayDark:    'rgba(0, 0, 0, 0.7)',    // modal backdrop (heavier)
};

// ── Typography ────────────────────────────────────────────────────────────────
export const typography = {
    fontFamily: 'Arial, sans-serif',

    // Scale (px)
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

// ── Shape ─────────────────────────────────────────────────────────────────────
export const shape = {
    radiusSm:    '4px',     // buttons, inputs (portal)
    radiusMd:    '6px',     // buttons, inputs (login page)
    radiusLg:    '8px',     // cards, modals
    radiusXl:    '12px',    // login card
    radiusRound: '50%',     // avatar circle, add-user (+) button
};

// ── Shadows ───────────────────────────────────────────────────────────────────
export const shadows = {
    card:       '0 4px 15px rgba(0, 0, 0, 0.1)',   // portal cards
    popup:      '0 4px 15px rgba(0, 0, 0, 0.3)',   // confirmation popups
    popupLarge: '0 4px 20px rgba(0, 0, 0, 0.2)',   // large modals
    loginCard:  '0 8px 20px #c65c1a',              // login box (branded shadow)
};

// ── Trim (top / bottom decorative bars) ──────────────────────────────────────
export const trim = {
    color:  colors.primary,
    height: '40px',
};

// ── Convenience default export (all tokens in one object) ─────────────────────
const Theme = { brand, colors, typography, shape, shadows, trim };
export default Theme;
