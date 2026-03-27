import { test, expect } from '@playwright/test';

test('login logic 3: empty password shows validation message', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="userId"]', 'admin');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Password field cannot be empty.')).toBeVisible();
});
