import { test, expect } from '@playwright/test';

test('Signup should show error for already registered email', async ({ page }) => {
  await page.goto('/signup');

  // 'admin@test.com' is hardcoded as existing in serverSimulation.js
  await page.fill('input[name="userName"]', 'TestUser');
  await page.fill('input[name="email"]', 'admin@test.com');
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirmPassword"]', '123456');

  await page.click('button[type="submit"]');

  // Verify the ErrorPopup displays the message from the mock server
  const errorPopup = page.locator('text=/This email is already registered/i');
  // Timeout set to 10s to account for the 5s minWait in authHandler
  await expect(errorPopup).toBeVisible({ timeout: 10000 });
});