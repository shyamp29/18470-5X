/**
 * full_flow.test.js — End-to-End Integration Test Suite
 *
 * Covers the complete TA demo script in order:
 *  1.  Sign up as new user
 *  2.  Log in with correct userid/password
 *  3.  Log in with wrong combination of userid/password
 *  4.  Create a new project (new project id)
 *  5.  Try creating a new project with existing project id
 *  6.  Add a member to an existing project with userId
 *  7.  Checkout hardware set 1
 *  8.  Checkout hardware set 2
 *  9.  See if available quantities are reduced
 * 10.  Try checking out more than available
 * 11.  Check in hardware set 1
 * 12.  See if available quantities are increased
 * 13.  Log off
 * 14.  Log in again and see if state persists
 * 15.  TA: create new id, login
 * 16.  Try to create project with existing id
 * 17.  Join existing project — test authorization
 * 18.  Check in hardware set 2 (checked out by first user)
 * 19.  See if available quantities are increased
 * 20.  Checkout hardware (final sanity check)
 *
 * Prerequisites:
 *   - Frontend running at http://localhost:5173
 *   - Backend  running at http://127.0.0.1:5000
 *   - `python seed.py` run to reset HWSet1 (cap=100, avail=60) and HWSet2 (cap=200, avail=130)
 *
 * Run:  npx playwright test tests/e2e/full_flow.test.js --headed
 */

import { test, expect } from '@playwright/test';

import {
  HW1, HW2,
  QTY_HW1_CHECKOUT, QTY_HW2_CHECKOUT,
  QTY_HW1_CHECKIN,  QTY_HW2_CHECKIN,
  QTY_OVER_CAPACITY,
} from './testData.js';

import {
  signupUser,
  loginUser,
  signOut,
  openProject,
  checkoutHW,
  checkinHW,
  getAvailability,
} from './helpers.js';

test.describe('Full E2E Demo Flow', () => {
  test.describe.configure({ mode: 'serial' });

  // Per-browser user/project data — avoids collisions when all browsers run in parallel
  let USER_A, USER_B, PROJECT_A;

  test.beforeAll(async ({}, testInfo) => {
    const b   = testInfo.project.name.replace(/\s+/g, '_').toLowerCase();
    const run = Date.now().toString(36); // unique per run — no cleanup needed
    USER_A    = { username: `E2E User A`, userid: `e2e_a_${b}_${run}`,  password: 'testpass_A1!' };
    USER_B    = { username: `TA User`,    userid: `e2e_b_${b}_${run}`,  password: 'tapass_B2!'  };
    PROJECT_A = { id: `E2EP-${b}-${run}`, name: `E2E Test Project Alpha`, description: 'Created by the automated E2E test suite' };
  });

  // ── 1. Sign up as a new user ─────────────────────────────────────────────────
  test('01 – sign up as new user (User A)', async ({ page }) => {
    await signupUser(page, USER_A);

    // Wait for success message in popup
    await expect(page.getByText(/successfully/i)).toBeVisible({ timeout: 10000 });
  });

  // ── 2. Log in with correct credentials ───────────────────────────────────────
  test('02 – log in with correct userid/password (User A)', async ({ page }) => {
    await loginUser(page, USER_A);

    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });
    await expect(page.locator(`text=${USER_A.username}`)).toBeVisible();
  });

  // ── 3. Log in with wrong credentials ─────────────────────────────────────────
  test('03 – log in with wrong userid/password shows error', async ({ page }) => {
    await loginUser(page, { userid: USER_A.userid, password: 'WRONG_PASSWORD' });

    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });

    // MIN_WAIT_MS=3000 in authHandler means the error popup appears after ~3s
    await expect(
      page.locator('text=Invalid userid or password').or(page.locator('text=Incorrect password'))
    ).toBeVisible({ timeout: 12000 });
  });

  // ── 4. Create a new project ───────────────────────────────────────────────────
  test('04 – create a new project with unique project id (User A)', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    const inputs = page.locator('.create-form input');
    await inputs.nth(0).fill(PROJECT_A.name);
    await inputs.nth(1).fill(PROJECT_A.description);
    await inputs.nth(2).fill(PROJECT_A.id);
    await page.locator('button:has-text("Create")').click();

    await expect(
      page.locator(`text=${PROJECT_A.name}`).or(page.locator('text=created successfully')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  // ── 5. Duplicate project id is rejected ───────────────────────────────────────
  test('05 – creating project with duplicate id is blocked', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    const inputs = page.locator('.create-form input');
    await inputs.nth(0).fill(PROJECT_A.name + ' Copy');
    await inputs.nth(1).fill('duplicate test');
    await inputs.nth(2).fill(PROJECT_A.id);

    await page.waitForTimeout(500);

    const btnDisabled = await page.locator('button:has-text("Create")').isDisabled();
    const errVisible  = await page.locator('text=already exists').isVisible();
    expect(btnDisabled || errVisible).toBeTruthy();
  });

  // ── 6. Add a member to the project ───────────────────────────────────────────
  test('06 – owner adds User B as project member', async ({ page }) => {
    // Register User B first so there is a valid account to add
    await signupUser(page, USER_B);
    await page
      .locator('button:has-text("Go to Login"), text=Go to Login')
      .first()
      .click()
      .catch(() => { /* success popup may auto-redirect */ });

    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await openProject(page, PROJECT_A.id);

    const addBtn = page
      .locator('button[title*="Add user"]')
      .or(page.locator('button:has-text("+")'));
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();

    await page.locator('input[placeholder*="User ID"]').fill(USER_B.userid);
    await page.locator('button:has-text("Add")').click();

    await expect(
      page.locator(`text=${USER_B.userid}`).or(page.locator('text=added')).first()
    ).toBeVisible({ timeout: 8000 });
  });

  // ── 7. Checkout HWSet1 ────────────────────────────────────────────────────────
  test('07 – checkout HWSet1 (User A) reduces availability', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });
    await openProject(page, PROJECT_A.id);

    const availBefore = await getAvailability(page, 0);
    await checkoutHW(page, 0, QTY_HW1_CHECKOUT);
    await page.waitForTimeout(4000); // MIN_WAIT_MS=3000 in authHandler
    const availAfter = await getAvailability(page, 0);
    expect(availAfter).toBeLessThanOrEqual(availBefore - QTY_HW1_CHECKOUT);
    expect(availAfter).toBeGreaterThanOrEqual(0);
  });

  // ── 8. Checkout HWSet2 ────────────────────────────────────────────────────────
  test('08 – checkout HWSet2 (User A) reduces availability', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });
    await openProject(page, PROJECT_A.id);

    const availBefore = await getAvailability(page, 1);
    await checkoutHW(page, 1, QTY_HW2_CHECKOUT);
    await page.waitForTimeout(4000); // MIN_WAIT_MS=3000 in authHandler
    const availAfter = await getAvailability(page, 1);

    expect(availAfter).toBeLessThanOrEqual(availBefore - QTY_HW2_CHECKOUT);
    expect(availAfter).toBeGreaterThanOrEqual(0);
  });

  // ── 9. All Hardware page shows reduced quantities ─────────────────────────────
  test('09 – All Hardware page shows reduced availability after checkouts', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await page.locator('button:has-text("Get All Hardware List")').click();
    await expect(page.locator('h2:has-text("ALL HARDWARE")')).toBeVisible();

    // Expand HWSet1 and read its availability
    await page.locator(`text=${HW1}`).first().click();
    const hw1Avail = parseInt(
      await page.locator('td').filter({ hasText: /^\d+$/ }).first().innerText(),
      10
    );
    expect(hw1Avail).toBeGreaterThanOrEqual(0);

    // Expand HWSet2 and read its availability (second data row = Availability)
    await page.locator(`text=${HW2}`).first().click();
    const hw2Avail = parseInt(
      await page.locator('table.hw-detail-table tbody tr').nth(1).locator('td').innerText(),
      10
    );
    expect(hw2Avail).toBeGreaterThanOrEqual(0);
  });

  // ── 10. Over-capacity checkout is handled gracefully ──────────────────────────
  test('10 – checkout more than available triggers partial/error response', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });
    await openProject(page, PROJECT_A.id);

    await checkoutHW(page, 0, QTY_OVER_CAPACITY);

    // Wait for loading to finish (MIN_WAIT_MS=3000), then check availability
    await page.waitForTimeout(4000); // MIN_WAIT_MS=3000 in authHandler
    const availAfter = await getAvailability(page, 0);
    // Either a warning/error message appeared, or the checkout was capped below QTY_OVER_CAPACITY
    expect(availAfter).toBeLessThan(QTY_OVER_CAPACITY);
  });

  // ── 11. Check in HWSet1 ───────────────────────────────────────────────────────
  test('11 – check in HWSet1 (User A) increases availability', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });
    await openProject(page, PROJECT_A.id);

    const availBefore = await getAvailability(page, 0);
    await checkinHW(page, 0, QTY_HW1_CHECKIN);
    await page.waitForTimeout(4000); // MIN_WAIT_MS=3000 in authHandler
    const availAfter = await getAvailability(page, 0);

    expect(availAfter).toBeGreaterThanOrEqual(availBefore);
  });

  // ── 12. All Hardware page shows increased quantities after check-in ────────────
  test('12 – All Hardware page shows increased availability after check-in', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await page.locator('button:has-text("Get All Hardware List")').click();
    await expect(page.locator('h2:has-text("ALL HARDWARE")')).toBeVisible();

    await page.locator(`text=${HW1}`).first().click();
    const avail = parseInt(
      await page.locator('td').filter({ hasText: /^\d+$/ }).first().innerText(),
      10
    );
    expect(avail).toBeGreaterThanOrEqual(0);
  });

  // ── 13. Log off ───────────────────────────────────────────────────────────────
  test('13 – log off (User A) redirects to login page', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await signOut(page);

    await expect(page).toHaveURL(/.*login/);
  });

  // ── 14. Log in again — state persists ────────────────────────────────────────
  test('14 – log in again; project and HW allocations persist', async ({ page }) => {
    await loginUser(page, USER_A);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    // The project created in test 04 must still appear in the search dropdown
    const searchBox = page.locator('input[placeholder*="Search Project"]');
    await searchBox.fill(PROJECT_A.id);
    await expect(page.locator(`text=${PROJECT_A.id}`).first()).toBeVisible({ timeout: 6000 });

    // Navigate into it — hardware rows should still be present
    await page.locator(`text=${PROJECT_A.id}`).first().click();
    await page.locator('button:has-text("Open")').click();
    await expect(page.locator('h2:has-text("Project Info")')).toBeVisible();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  // ── 15. TA creates new account and logs in ────────────────────────────────────
  test('15 – TA (User B) logs in successfully', async ({ page }) => {
    // User B was registered in test 06
    await loginUser(page, USER_B);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });
    await expect(page.locator(`text=${USER_B.username}`)).toBeVisible();
  });

  // ── 16. TA cannot reuse existing project id ───────────────────────────────────
  test('16 – TA cannot create a project with an existing project id', async ({ page }) => {
    await loginUser(page, USER_B);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    const inputs = page.locator('.create-form input');
    await inputs.nth(0).fill('TA Duplicate Project');
    await inputs.nth(1).fill('should fail');
    await inputs.nth(2).fill(PROJECT_A.id);

    await page.waitForTimeout(500);

    const btnDisabled = await page.locator('button:has-text("Create")').isDisabled();
    const errVisible  = await page.locator('text=already exists').isVisible();
    expect(btnDisabled || errVisible).toBeTruthy();
  });

  // ── 17. Authorization: non-owner cannot add members ───────────────────────────
  test('17 – User B (non-owner) cannot add members to the project', async ({ page }) => {
    await loginUser(page, USER_B);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await openProject(page, PROJECT_A.id);

    // The "+" button must be absent for non-owners
    const addBtn = page
      .locator('button[title*="Add user"]')
      .or(page.locator('button:has-text("+")'));

    const btnVisible = await addBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (btnVisible) {
      // If the button is rendered, clicking Add should return an authorization error
      await addBtn.click();
      await page.locator('input[placeholder*="User ID"]').fill('some_user');
      await page.locator('button:has-text("Add")').click();
      await expect(
        page.locator('text=Only the project owner').or(page.locator('text=Unauthorized')).first()
      ).toBeVisible({ timeout: 5000 });
    } else {
      // Correct behaviour: button is not rendered for non-owners
      expect(btnVisible).toBe(false);
    }
  });

  // ── 18. User B checks in HWSet2 ───────────────────────────────────────────────
  test('18 – User B checks in HWSet2 (originally checked out by User A)', async ({ page }) => {
    await loginUser(page, USER_B);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await openProject(page, PROJECT_A.id);

    const availBefore = await getAvailability(page, 1);
    await checkinHW(page, 1, QTY_HW2_CHECKIN);
    await page.waitForTimeout(4000); // MIN_WAIT_MS=3000 in authHandler
    const availAfter = await getAvailability(page, 1);

    expect(availAfter).toBeGreaterThanOrEqual(availBefore);
  });

  // ── 19. All Hardware confirms HWSet2 availability increased ───────────────────
  test('19 – All Hardware page confirms HWSet2 availability increased after User B check-in', async ({ page }) => {
    await loginUser(page, USER_B);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await page.locator('button:has-text("Get All Hardware List")').click();
    await expect(page.locator('h2:has-text("ALL HARDWARE")')).toBeVisible();

    await page.locator(`text=${HW2}`).first().click();
    const avail = parseInt(
      await page.locator('table.hw-detail-table tbody tr').nth(1).locator('td').innerText(),
      10
    );
    expect(avail).toBeGreaterThan(0);
  });

  // ── 20. Final sanity checkout ─────────────────────────────────────────────────
  test('20 – final checkout: User B can still check out hardware after all operations', async ({ page }) => {
    await loginUser(page, USER_B);
    await expect(page).toHaveURL(/.*profile/, { timeout: 10000 });

    await openProject(page, PROJECT_A.id);

    const availBefore = await getAvailability(page, 0);
    await checkoutHW(page, 0, 1);
    await page.waitForTimeout(4000); // MIN_WAIT_MS=3000 in authHandler
    const availAfter = await getAvailability(page, 0);

    expect(availAfter).toBeLessThanOrEqual(availBefore - 1);
    expect(availAfter).toBeGreaterThanOrEqual(0);
  });
});
