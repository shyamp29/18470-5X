import { test, expect } from '@playwright/test';

test('login logic 1: login with valid credentials should trigger loading', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userid"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/Loading/i')).toBeVisible();
});
