import { test, expect } from '@playwright/test';

test('login snapshot 4: login error state', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userId"]', 'wrong');
  await page.fill('input[name="password"]', 'wrong');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(6000);
  await expect(page).toHaveScreenshot('login-error.png');
});
