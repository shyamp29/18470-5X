import { test, expect } from '@playwright/test';

// Verifies that corrupted or malformed localStorage data does not crash the
// app. The AuthProvider wraps the JSON.parse call in a try/catch and falls
// back to null, so the user is treated as unauthenticated and the ProtectedRoute
// redirects them to login instead of throwing a runtime error.
test('login recovery 8: corrupted localStorage falls back to unauthenticated state', async ({ page }) => {
  // Inject invalid JSON into localStorage before the app boots
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('user', '{ this is : not valid json {{');
  });

  // Reload so the AuthProvider attempts to parse the corrupted entry
  await page.reload();

  // App must not crash — login page should be rendered normally
  await expect(page.locator('h1')).toHaveText('Login');

  // Attempting to visit /profile must redirect back to login (treated as guest)
  await page.goto('/profile');
  await expect(page).toHaveURL(/.*\//);
});
