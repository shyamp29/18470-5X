import { test, expect } from '@playwright/test';

test.describe('Login Server Simulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should show loading state and handle invalid login', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[name="userid"]', 'wrong_user');
    await page.fill('input[name="password"]', 'wrong_password');
    await page.click('button[type="submit"]');

    // 1. Verify LoadingPopup appears (triggered by setIsLoading(true))
    // The LoadingPopup shows "Loading " with animated dots
    await expect(page.locator('text=/Loading/i')).toBeVisible();

    // 2. Verify Error Message after the 5-second mock wait
    // The actual error message from authHandler is "Invalid userid or password. Please try again."
    const serverError = page.locator('text=/Invalid userid or password/i');
    await expect(serverError).toBeVisible({ timeout: 10000 });
  });
});