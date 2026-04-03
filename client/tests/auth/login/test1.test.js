import { test, expect } from '@playwright/test';

test.describe('Login UI and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render header and input fields', async ({ page }) => {
    // Verifies the <h1>Login</h1> is present
    await expect(page.locator('h1')).toHaveText('Login');
    await expect(page.locator('label:has-text("User ID")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
  });

  test('should navigate to signup via footer link', async ({ page }) => {
    // Clicks the "Sign-up" span
    await page.click('text=Sign-up');
    // Verifies redirection
    await expect(page).toHaveURL(/.*signup/);
  });
});