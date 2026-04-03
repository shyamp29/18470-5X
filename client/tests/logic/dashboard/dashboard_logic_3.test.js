import { test, expect } from '@playwright/test';

test('dashboard logic 3: navigate to all projects list', async ({ page }) => {
  await page.goto('/profile');
  await page.click('button:has-text("Get All Projects List")');
  await expect(page.locator('text=All Projects List')).toBeVisible();
});
