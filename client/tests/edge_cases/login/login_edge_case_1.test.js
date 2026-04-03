import { test, expect } from '@playwright/test';

test('login edge case 1: empty username field', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Password field cannot be empty.')).toBeVisible();
});
