import { test, expect } from '@playwright/test';

test('dashboard snapshot 2: dashboard with project search', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('input[placeholder*="Search Project"]', 'PROJ-101');
  await expect(page.locator('.dashboard-content')).toHaveScreenshot('dashboard-search.png');
});
