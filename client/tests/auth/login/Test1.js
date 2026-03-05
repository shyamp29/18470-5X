import { test, expect } from '@playwright/test';

test.describe('Login Page UI and Logic', () => {
  
  test.beforeEach(async ({ page }) => {
    // Replace with your actual local dev URL
    await page.goto('http://localhost:5173/login'); 
  });

  test('should render all basic UI elements', async ({ page }) => {
    // Checks for the header text defined in LoginPage.js
    await expect(page.locator('h1')).toHaveText('Login');
    
    // Verifies the labels exist
    await expect(page.locator('label:has-text("User ID")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
    
    // Verifies the submit button exists
    await expect(page.getByRole('button', { name: /Submit/i })).toBeVisible();
  });

  test('should trigger error popup when password is empty', async ({ page }) => {
    // Fill User ID but leave Password empty
    await page.fill('input[name="userId"]', 'test_user');
    await page.click('button[type="submit"]');

    // Verify the specific error message set in LoginPage.js handleLogin
    const errorMsg = page.locator('text=Password field cannot be empty.');
    await expect(errorMsg).toBeVisible();
  });

  test('should show loading popup during authentication', async ({ page }) => {
    await page.fill('input[name="userId"]', 'validUser');
    await page.fill('input[name="password"]', 'validPass');
    await page.click('button[type="submit"]');

    // Your authHandler.js triggers a LoadingPopup
    // and waits for at least 5 seconds (5000ms)
    const loader = page.locator('div:has-text("Loading")'); // Adjust selector based on LoadingPopup content
    await expect(loader).toBeVisible();
  });

  test('should navigate to Signup page when link is clicked', async ({ page }) => {
    // Locates the "Sign-up" span within the footer
    await page.click('text=Sign-up');

    // Verifies that handleAuthAction(AUTH_ACTIONS.SIGNUP_REDIRECT) was triggered
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should show error for invalid credentials from server', async ({ page }) => {
    await page.fill('input[name="userId"]', 'wrongUser');
    await page.fill('input[name="password"]', 'wrongPass');
    await page.click('button[type="submit"]');

    // Check for the error message defined in authHandler.js
    const dbError = page.locator('text=User not found on database');
    await expect(dbError).toBeVisible({ timeout: 10000 }); // Longer timeout for the 5s mock wait
  });
});