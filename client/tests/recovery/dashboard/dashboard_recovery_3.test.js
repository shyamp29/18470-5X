import { test, expect } from '@playwright/test';

test('dashboard recovery 3: navigation state recovery', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('input[placeholder*="Search Project"]', 'PROJ-101');
  await page.locator('text=PROJ-101').first().click();

  // Navigate away and back
  await page.click('button:has-text("Get All Hardware List")');
  await page.click('button:has-text("← Back")');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
