import { test, expect } from '@playwright/test';

test('dashboard logic 2: create project path active', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('input[placeholder*="Project ID"]', `TEST-${Date.now()}`);
  await page.fill('input[placeholder*="Project Name"]', 'ProjectLogic');
  await page.fill('textarea[placeholder*="Description"]', 'Test project logic');
  await page.click('button:has-text("Create Project")');
  await expect(page.locator('text=/created successfully/i')).toBeVisible({ timeout: 10000 });
});
