import { test, expect } from '@playwright/test';

test('signup snapshot 2: signup form filled', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'testuser');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirmPassword"]', 'password123');
  await expect(page.locator('form')).toHaveScreenshot('signup-form-filled.png');
});
