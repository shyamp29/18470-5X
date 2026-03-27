import { test, expect } from '@playwright/test';

test('signup recovery 2: network failure during signup', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'testuser');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirmPassword"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for potential network issues
  await page.waitForTimeout(6000);
  await expect(page.locator('text=/Loading/i')).toBeHidden();
});
