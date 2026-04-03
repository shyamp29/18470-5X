import { test, expect } from '@playwright/test';

test('login edge case 4: multiple rapid login attempts', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userid"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');

  // Click submit multiple times rapidly
  await page.click('button[type="submit"]');
  await page.click('button[type="submit"]');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=/Loading/i')).toBeVisible();
});
