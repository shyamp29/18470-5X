import { test, expect } from '@playwright/test';

test('login access 4: submit triggers error on missing creds', async ({ page }) => {
  await page.goto('/login');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Password field cannot be empty.')).toBeVisible();
});
