import { test, expect } from '@playwright/test';

test('login routing 1: login to profile route', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userid"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*profile/);
});
