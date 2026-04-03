import { test, expect } from '@playwright/test';

test('dashboard recovery 1: session timeout recovery', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.locator('text=Welcome')).toBeVisible();

  // Simulate session timeout
  await page.evaluate(() => {
    localStorage.setItem('token', 'expired');
  });
  await page.reload();
  await expect(page).toHaveURL(/.*login/);
});
