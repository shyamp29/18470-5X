import { test, expect } from '@playwright/test';

test('signup logic 2: sign up with existing email shows error', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="email"]', 'admin@test.com');
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirmPassword"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/This email is already registered/i')).toBeVisible({ timeout: 10000 });
});
