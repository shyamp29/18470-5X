import { test, expect } from '@playwright/test';

test('login access 3: shows required fields', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('input[name="userId"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});
