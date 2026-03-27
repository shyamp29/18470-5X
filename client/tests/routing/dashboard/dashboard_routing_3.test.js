import { test, expect } from '@playwright/test';

test('dashboard routing 3: choose project and go to project info', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('input[placeholder*="Search Project"]', 'PROJ-101');
  await page.locator('text=PROJ-101').first().click();
  await page.click('button:has-text("Go to Project Info")');
  await expect(page.locator('text=Project Info')).toBeVisible();
});
