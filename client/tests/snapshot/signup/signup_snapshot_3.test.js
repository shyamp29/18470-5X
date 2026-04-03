import { test, expect } from '@playwright/test';

test('signup snapshot 3: signup loading state', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'testuser');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirmPassword"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot('signup-loading.png');
});
