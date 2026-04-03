import { test, expect } from '@playwright/test';

test('login recovery 1: network timeout recovery', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userid"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Wait for potential timeout and recovery
  await page.waitForTimeout(6000);
  await expect(page.locator('text=Welcome')).toBeVisible();
});
