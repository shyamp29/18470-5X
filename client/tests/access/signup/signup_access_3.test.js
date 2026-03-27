import { test } from '@playwright/test';

test('signup access 3: invalid password match shows alert', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="password"]', '123');
  await page.fill('input[name="confirmPassword"]', '456');
  page.on('dialog', async (dialog) => { await dialog.accept(); });
  await page.click('button[type="submit"]');
});
