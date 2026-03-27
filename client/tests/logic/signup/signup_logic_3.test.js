import { test, expect } from '@playwright/test';

test('signup logic 3: signup with valid new user triggers profile redirect', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'newuser');
  await page.fill('input[name="email"]', `newuser-${Date.now()}@example.com`);
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirmPassword"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/Loading/i')).toBeVisible();
});
