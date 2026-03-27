import { test, expect } from '@playwright/test';

test('dashboard edge case 3: rapid button clicks', async ({ page }) => {
  await page.goto('/profile');
  // Click buttons rapidly
  await page.click('button:has-text("Get All Projects List")');
  await page.click('button:has-text("Get All Hardware List")');
  await page.click('button:has-text("Get All Projects List")');
  await expect(page.locator('text=All Projects List')).toBeVisible();
});
