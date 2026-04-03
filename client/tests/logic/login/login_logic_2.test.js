import { test, expect } from '@playwright/test';

test('login logic 2: invalid login should show error', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userid"]', 'wrong');
  await page.fill('input[name="password"]', 'wrong');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=/Invalid userid or password/i')).toBeVisible({ timeout: 10000 });
});
