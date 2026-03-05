import { test, expect } from '@playwright/test';

test.describe('Login Validation Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should not trigger anything if both fields are empty', async ({ page }) => {
    await page.click('button[type="submit"]');
    // The ErrorPopup should NOT be visible because the function returns early
    const errorPopup = page.locator('text=Password field cannot be empty.');
    await expect(errorPopup).not.toBeVisible();
  });

  test('should show error if password is empty but ID is filled', async ({ page }) => {
    await page.fill('input[name="userId"]', 'Adetayo');
    await page.click('button[type="submit"]');
    
    // Verifies the specific error message you set
    await expect(page.locator('text=Password field cannot be empty.')).toBeVisible();
  });
});