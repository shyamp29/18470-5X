import { test, expect } from '@playwright/test';

test('login routing 3: signup back to login', async ({ page }) => {
  await page.goto('/signup');
  await page.goBack();
  await expect(page).toHaveURL(/.*login/);
});
