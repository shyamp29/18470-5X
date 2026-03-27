import { test, expect } from '@playwright/test';

test('login snapshot 1: login page visual', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveScreenshot('login-page.png');
});
