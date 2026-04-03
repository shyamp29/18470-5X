import { test, expect } from '@playwright/test';

test('signup edge case 3: duplicate username', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'admin');
  await page.fill('input[name="email"]', 'newadmin@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirmPassword"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/Loading/i')).toBeVisible();
});
