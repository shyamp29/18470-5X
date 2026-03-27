import { test, expect } from '@playwright/test';

test('login routing 2: login to signup via link', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Sign-up');
  await expect(page).toHaveURL(/.*signup/);
});
