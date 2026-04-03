import { test, expect } from '@playwright/test';

test('dashboard access 1: welcome text exists', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
