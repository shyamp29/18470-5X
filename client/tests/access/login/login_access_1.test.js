import { test, expect } from '@playwright/test';

test('login access 1: show login page', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toHaveText('Login');
});
