import { test, expect } from '@playwright/test';

test('login edge case 3: very long username', async ({ page }) => {
  await page.goto('/login');
  const longUsername = 'a'.repeat(1000);
  await page.fill('input[name="userid"]', longUsername);
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/Loading/i')).toBeVisible();
});
