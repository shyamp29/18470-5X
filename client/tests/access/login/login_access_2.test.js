import { test, expect } from '@playwright/test';

test('login access 2: can navigate to signup', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Sign-up');
  await expect(page).toHaveURL(/.*signup/);
});
