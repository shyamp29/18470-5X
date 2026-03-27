import { test, expect } from '@playwright/test';

test('login snapshot 2: login form filled', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userId"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await expect(page.locator('form')).toHaveScreenshot('login-form-filled.png');
});
