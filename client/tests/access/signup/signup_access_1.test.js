import { test, expect } from '@playwright/test';

test('signup access 1: show signup page', async ({ page }) => {
  await page.goto('/signup');
  await expect(page.locator('h1')).toHaveText('Sign Up');
});
