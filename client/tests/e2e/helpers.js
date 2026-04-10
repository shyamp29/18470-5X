/**
 * helpers.js — Reusable page-interaction helpers for the E2E demo flow.
 *
 * All functions receive a Playwright `page` object as their first argument.
 * None of these functions contain assertions about business logic — they are
 * pure navigation / interaction utilities.
 */

import { expect } from '@playwright/test';

// ── Authentication ────────────────────────────────────────────────────────────

/** Navigate to /login and wait for the submit button to be ready. */
export async function goToLogin(page) {
  await page.goto('/login');
  await expect(page.locator('button[type="submit"]')).toBeVisible();
}

/**
 * Fill the signup form with the given credentials and submit.
 * Does NOT assert the outcome — let the calling test do that.
 */
export async function signupUser(page, { username, userid, password }) {
  await page.goto('/signup');
  await page.fill('input[name="username"]',        username);
  await page.fill('input[name="userid"]',          userid);
  await page.fill('input[name="password"]',        password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
}

/**
 * Navigate to /login, fill credentials, and click Sign In.
 * Does NOT assert the outcome — let the calling test do that.
 */
export async function loginUser(page, { userid, password }) {
  await goToLogin(page);
  await page.fill('input[name="userid"]',   userid);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

/**
 * Open the profile-circle dropdown and click "Sign Out".
 * Asserts redirect to /login before returning.
 */
export async function signOut(page) {
  // The profile avatar circle is a div whose inline style includes border-radius
  await page
    .locator('[style*="borderRadius: var(--radius-round)"], div[style*="border-radius"]')
    .first()
    .click();
  await page.getByText('Sign Out').click();
  await expect(page).toHaveURL(/.*login/);
}

// ── Project navigation ────────────────────────────────────────────────────────

/**
 * From the dashboard, search for a project by ID, select it from the
 * autocomplete dropdown, and click Open.
 * Asserts the Project Info heading is visible before returning.
 */
export async function openProject(page, projectid) {
  await page.goto('/profile');
  const searchBox = page.locator('input[placeholder*="Search Project"]');
  await searchBox.fill(projectid);

  const dropdownItem = page.locator(`text=${projectid}`).first();
  await dropdownItem.waitFor({ state: 'visible', timeout: 5000 });
  await dropdownItem.click();

  await page.locator('button:has-text("Open")').click();
  await expect(page.locator('h2:has-text("Project Info")')).toBeVisible();
}

// ── Hardware operations ───────────────────────────────────────────────────────

/**
 * On the Project Info page, enter a qty in the row at `hwRowIndex` (0-based)
 * and click Check Out.
 */
export async function checkoutHW(page, hwRowIndex, qty) {
  const row = page.locator('table tbody tr').nth(hwRowIndex);
  await row.locator('input[type="number"]').fill(String(qty));
  await page.locator('button:has-text("Check Out")').first().click();
}

/**
 * On the Project Info page, enter a qty in the row at `hwRowIndex` (0-based)
 * and click Check In.
 */
export async function checkinHW(page, hwRowIndex, qty) {
  const row = page.locator('table tbody tr').nth(hwRowIndex);
  await row.locator('input[type="number"]').fill(String(qty));
  await page.locator('button:has-text("Check In")').first().click();
}

/**
 * Read the Availability cell for a hardware row on the Project Info table.
 * Table columns: HW Set | Capacity | Available | Allocated | Qty
 * "Available" is the 3rd <td> (index 2) in each body row.
 * Returns the parsed integer.
 */
export async function getAvailability(page, hwRowIndex) {
  const row       = page.locator('table tbody tr').nth(hwRowIndex);
  const availCell = row.locator('td').nth(2);
  const text      = await availCell.innerText();
  return parseInt(text.trim(), 10);
}
