/**
 * testData.js — Shared test constants for the E2E demo flow.
 *
 * Import these in any test file that needs the seeded users, project, or HW data.
 *
 * Prerequisites (run once before the suite):
 *   python seed.py   →  HWSet1 cap=100 avail=60,  HWSet2 cap=200 avail=130
 */

// ── Users ────────────────────────────────────────────────────────────────────

/** Primary test user — created fresh by test 01. */
export const USER_A = {
  username: 'E2E User A',
  userid:   'e2e_user_a',
  password: 'testpass_A1!',
};

/** "TA" user — registered in test 06, used from test 15 onward. */
export const USER_B = {
  username: 'TA User',
  userid:   'ta_user_e2e',
  password: 'tapass_B2!',
};

// ── Project ──────────────────────────────────────────────────────────────────

/** Project created by User A in test 04. */
export const PROJECT_A = {
  id:          'E2E-PROJ-A',
  name:        'E2E Test Project Alpha',
  description: 'Created by the automated E2E test suite',
};

// ── Hardware ─────────────────────────────────────────────────────────────────

export const HW1 = 'HWSet1';
export const HW2 = 'HWSet2';

/** Safe quantities — well within seeded availability (60 / 130). */
export const QTY_HW1_CHECKOUT = 5;
export const QTY_HW2_CHECKOUT = 8;

/** Full return quantities matching the checkout amounts. */
export const QTY_HW1_CHECKIN = 5;
export const QTY_HW2_CHECKIN = 8;

/** Deliberately exceeds any realistic availability to trigger a partial-checkout response. */
export const QTY_OVER_CAPACITY = 10000;
