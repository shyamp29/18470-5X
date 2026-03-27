import { test, expect } from '@playwright/test';

// Verifies that navigating to the login page while already authenticated
// (localStorage has a valid user entry) redirects to /profile instead of
// showing the login form. Tests the GuestRoute guard added to AppRouter.
test('login recovery 6: authenticated user redirected away from login page', async ({ page }) => {
  // Pre-seed localStorage with a valid user session before the app loads
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('user', JSON.stringify({
      userid:   'admin',
      username: 'Admin User',
      token:    'mock-token-admin-1',
    }));
  });

  // Navigating to login should redirect to /profile via GuestRoute
  await page.goto('/');
  await expect(page).toHaveURL(/.*profile/);
  // Login form must NOT be visible
  await expect(page.locator('h1')).not.toHaveText('Login');
});
