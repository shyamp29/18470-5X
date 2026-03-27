import { test } from '@playwright/test';

test('signup logic 1: password mismatch alert', async ({ page }) => {
  await page.goto('/signup');
  page.on('dialog', async (dialog) => { await dialog.accept(); });
  await page.fill('input[name="password"]', 'a');
  await page.fill('input[name="confirmPassword"]', 'b');
  await page.click('button[type="submit"]');
});
