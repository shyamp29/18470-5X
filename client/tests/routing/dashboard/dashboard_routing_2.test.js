import { test, expect } from '@playwright/test';

test('dashboard routing 2: profile -> all hardware -> back', async ({ page }) => {
  await page.goto('/profile');
  await page.click('button:has-text("Get All Hardware List")');
  await expect(page.locator('text=All Hardware List')).toBeVisible();
  await page.click('button:has-text("← Back")');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
