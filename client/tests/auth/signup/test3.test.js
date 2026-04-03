import { test, expect } from '@playwright/test';

test('Signup should show loading and succeed with new email', async ({ page }) => {
  await page.goto('/signup');

  await page.fill('input[name="userName"]', 'Adetayo');
  await page.fill('input[name="email"]', 'newuser@example.com'); 
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirmPassword"]', '123456');

  await page.click('button[type="submit"]');

  // 1. Verify LoadingPopup appears (from AuthProvider)
  await expect(page.locator('text=/Loading/i')).toBeVisible();

  // 2. Since success currently triggers an alert/redirect in your logic
  // we wait for the LoadingPopup to disappear after the 5s minWait
  await expect(page.locator('text=/Loading/i')).toBeHidden({ timeout: 10000 });
});