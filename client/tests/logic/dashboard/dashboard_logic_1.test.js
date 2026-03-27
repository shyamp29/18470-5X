import { test, expect } from '@playwright/test';

test('dashboard logic 1: search and select project', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('input[placeholder*="Search Project"]', 'PROJ-101');
  await page.locator('text=PROJ-101').first().click();
  await expect(page.locator('button:has-text("Go to Project Info")')).toBeVisible();
});
