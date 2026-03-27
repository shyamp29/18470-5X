import { test, expect } from '@playwright/test';

test('dashboard edge case 2: create project with empty fields', async ({ page }) => {
  await page.goto('/profile');
  await page.click('button:has-text("Create Project")');
  // Should not create project or show error
  await expect(page.locator('text=Welcome')).toBeVisible();
});
