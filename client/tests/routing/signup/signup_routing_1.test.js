import { test, expect } from '@playwright/test';

test('signup routing 1: signup -> login using link', async ({ page }) => {
  await page.goto('/signup');
  await page.click('text=Login');
  await expect(page).toHaveURL(/.*login/);
});
