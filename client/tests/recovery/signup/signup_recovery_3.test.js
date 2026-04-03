import { test, expect } from '@playwright/test';

test('signup recovery 3: browser navigation recovery', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="userName"]', 'testuser');
  await page.click('text=Login');
  await expect(page).toHaveURL(/.*login/);

  // Navigate back
  await page.goBack();
  await expect(page).toHaveURL(/.*signup/);
});
