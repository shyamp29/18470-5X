import { test, expect } from '@playwright/test';

test('login recovery 2: session expired recovery', async ({ page }) => {
  await page.goto('/profile');
  // Simulate session expiry by clearing localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page).toHaveURL(/.*login/);
});
