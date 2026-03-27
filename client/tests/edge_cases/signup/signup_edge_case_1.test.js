import { test, expect } from '@playwright/test';

test('signup edge case 1: password too short', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'testuser');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', '123');
  await page.fill('input[name="confirmPassword"]', '123');
  page.on('dialog', async (dialog) => { await dialog.accept(); });
  await page.click('button[type="submit"]');
});
