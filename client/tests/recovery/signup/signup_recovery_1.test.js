import { test, expect } from '@playwright/test';

test('signup recovery 1: form data persistence on page refresh', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'testuser');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.reload();
  // Form should be cleared on refresh (expected behavior)
  await expect(page.locator('input[name="userName"]')).toHaveValue('');
});
