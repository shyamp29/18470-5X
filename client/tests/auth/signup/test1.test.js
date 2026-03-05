import { test, expect } from '@playwright/test';

test('Signup should fail locally if passwords do not match', async ({ page }) => {
  await page.goto('/signup');

  // Fill in different passwords
  await page.fill('input[name="password"]', 'Password123');
  await page.fill('input[name="confirmPassword"]', 'Different456');

  // Catch the browser alert you defined in SignupPage.js
  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe('Passwords must match!');
    await dialog.accept();
  });

  await page.click('button[type="submit"]');
});