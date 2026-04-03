import { test, expect } from '@playwright/test';

test('login recovery 4: browser back button recovery', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Sign-up');
  await expect(page).toHaveURL(/.*signup/);

  // Use browser back button
  await page.goBack();
  await expect(page).toHaveURL(/.*login/);
});
