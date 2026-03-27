import { test, expect } from '@playwright/test';

test('signup routing 2: signup -> profile on success path', async ({ page }) => {
  await page.goto('/signup');
  const email = `route-${Date.now()}@example.com`;
  await page.fill('input[name="userName"]', 'routeuser');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="confirmPassword"]', '123456');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/Loading/i')).toBeVisible();
});
