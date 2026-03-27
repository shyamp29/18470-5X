import { test, expect } from '@playwright/test';

test('signup access 2: required fields are visible', async ({ page }) => {
  await page.goto('/signup');
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});
