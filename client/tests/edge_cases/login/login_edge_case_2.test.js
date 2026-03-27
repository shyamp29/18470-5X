import { test, expect } from '@playwright/test';

test('login edge case 2: special characters in username', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userId"]', 'user@#$%^&*()');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/Loading/i')).toBeVisible();
});
