import { test, expect } from '@playwright/test';

test('login routing 4: unauthorized profile redirect to login', async ({ page }) => {
  await page.goto('/profile');
  await expect(page).toHaveURL(/.*login/);
});
