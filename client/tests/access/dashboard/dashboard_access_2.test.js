import { test, expect } from '@playwright/test';

test('dashboard access 2: project & hardware buttons exist', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.locator('button:has-text("Get All Projects List")')).toBeVisible();
  await expect(page.locator('button:has-text("Get All Hardware List")')).toBeVisible();
});
