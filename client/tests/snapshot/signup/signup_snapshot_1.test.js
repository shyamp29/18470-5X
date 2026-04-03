import { test, expect } from '@playwright/test';

test('signup snapshot 1: signup page visual', async ({ page }) => {
  await page.goto('/signup');
  await expect(page).toHaveScreenshot('signup-page.png');
});
