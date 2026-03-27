import { test, expect } from '@playwright/test';

test('login snapshot 3: login loading state', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userId"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot('login-loading.png');
});
