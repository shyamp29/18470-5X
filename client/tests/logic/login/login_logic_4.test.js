import { test, expect } from '@playwright/test';

test('login logic 4: submit button is present', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
