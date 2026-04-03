import { test, expect } from '@playwright/test';

test('dashboard recovery 2: page refresh recovery', async ({ page }) => {
  await page.goto('/profile');
  await page.click('button:has-text("Get All Projects List")');
  await expect(page.locator('text=All Projects List')).toBeVisible();

  // Refresh page
  await page.reload();
  await expect(page.locator('text=Welcome')).toBeVisible();
});
