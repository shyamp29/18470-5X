import { test, expect } from '@playwright/test';

test('dashboard access 3: sign out works', async ({ page }) => {
  await page.goto('/profile');
  await page.click('text=Sign Out');
  await expect(page).toHaveURL(/.*login/);
});
