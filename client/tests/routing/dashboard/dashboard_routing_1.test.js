import { test, expect } from '@playwright/test';

test('dashboard routing 1: profile -> all projects -> back', async ({ page }) => {
  await page.goto('/profile');
  await page.click('button:has-text("Get All Projects List")');
  await expect(page.locator('text=All Projects List')).toBeVisible();
  await page.click('button:has-text("← Back")');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
