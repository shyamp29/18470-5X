import { test, expect } from '@playwright/test';

test.describe('Login Server Simulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('cd/login');
  });

  test('should show loading state and handle invalid login', async ({ page }) => {
    await page.fill('input[name="userId"]', 'wrong_user');
    await page.fill('input[name="password"]', 'wrong_password');
    await page.click('button[type="submit"]');

    // 1. Verify LoadingPopup appears (triggered by setIsLoading(true))
    // Note: Adjust the selector if your LoadingPopup uses different text
    await expect(page.locator('text=/Loading/i')).toBeVisible();

    // 2. Verify Error Message after the 5-second mock wait
    const serverError = page.locator('text=/User not found on database/i');
    await expect(serverError).toBeVisible({ timeout: 10000 });
  });
});