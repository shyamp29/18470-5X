import { test, expect } from '@playwright/test';

test('login recovery 3: page refresh during login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userid"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Refresh during loading
  await page.waitForTimeout(2000);
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Login');
});
