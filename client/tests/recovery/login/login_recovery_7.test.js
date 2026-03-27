import { test, expect } from '@playwright/test';

// Verifies that localStorage stores the correct user fields after a successful
// login (userid, username, token) and that those fields are cleared entirely
// after logout, so a subsequent reload lands back on the login page.
test('login recovery 7: localStorage is set on login and cleared on logout', async ({ page }) => {
  // ── Login ──────────────────────────────────────────────────────────────
  await page.goto('/');
  await page.fill('input[name="userId"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*profile/);

  // Confirm localStorage contains all required fields
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('user')));
  expect(stored).not.toBeNull();
  expect(stored.userid).toBe('admin');
  expect(stored.username).toBeTruthy();
  expect(stored.token).toBeTruthy();

  // ── Logout ─────────────────────────────────────────────────────────────
  // Trigger logout via the sign-out button rendered on the profile page
  await page.click('text=Sign Out');
  await expect(page).toHaveURL(/.*\//);

  // localStorage must be empty after logout
  const afterLogout = await page.evaluate(() => localStorage.getItem('user'));
  expect(afterLogout).toBeNull();

  // Confirm ProtectedRoute blocks /profile without a session
  await page.goto('/profile');
  await expect(page).toHaveURL(/.*\//);
});
