import { test, expect } from '@playwright/test';

test('dashboard recovery 4: error state recovery', async ({ page }) => {
  await page.goto('/profile');
  // Try to navigate without selecting project
  await page.click('button:has-text("Go to Project Info")');
  // Should remain on dashboard (recovery from error state)
  await expect(page.locator('text=Welcome')).toBeVisible();
});
