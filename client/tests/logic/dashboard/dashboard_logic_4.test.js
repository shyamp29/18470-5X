import { test, expect } from '@playwright/test';

test('dashboard logic 4: navigate to all hardware list', async ({ page }) => {
  await page.goto('/profile');
  await page.click('button:has-text("Get All Hardware List")');
  await expect(page.locator('text=All Hardware List')).toBeVisible();
});
