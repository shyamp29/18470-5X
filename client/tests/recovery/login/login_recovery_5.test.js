import { test, expect } from '@playwright/test';

// Verifies that a logged-in user stays on /profile after a hard page refresh.
// This tests localStorage re-hydration: the AuthProvider reads the stored user
// on mount and the ProtectedRoute keeps the user on /profile instead of
// bouncing them back to login.
test('login recovery 5: logged-in user stays on profile after page refresh', async ({ page }) => {
  // Log in normally
  await page.goto('/');
  await page.fill('input[name="userid"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*profile/);

  // Simulate F5 — should re-hydrate from localStorage and stay on /profile
  await page.reload();
  await expect(page).toHaveURL(/.*profile/);
});
