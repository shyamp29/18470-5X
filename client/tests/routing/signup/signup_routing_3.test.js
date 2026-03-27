import { test, expect } from '@playwright/test';

test('signup routing 3: direct navigation to login from signup route', async ({ page }) => {
  await page.goto('/signup');
  await page.goto('/login');
  await expect(page).toHaveURL(/.*login/);
});
