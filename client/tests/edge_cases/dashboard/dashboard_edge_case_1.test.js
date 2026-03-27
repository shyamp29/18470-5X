import { test, expect } from '@playwright/test';

test('dashboard edge case 1: search with no results', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('input[placeholder*="Search Project"]', 'nonexistentproject');
  await page.waitForTimeout(1000);
  // Should not find any projects
  await expect(page.locator('text=PROJ-')).toHaveCount(0);
});
