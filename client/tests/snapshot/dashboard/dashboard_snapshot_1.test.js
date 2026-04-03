import { test, expect } from '@playwright/test';

test('dashboard snapshot 1: dashboard page visual', async ({ page }) => {
  await page.goto('/profile');
  await expect(page).toHaveScreenshot('dashboard-page.png');
});
