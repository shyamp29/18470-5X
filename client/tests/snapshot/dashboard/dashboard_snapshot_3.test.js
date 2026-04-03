import { test, expect } from '@playwright/test';

test('dashboard snapshot 3: dashboard create project form', async ({ page }) => {
  await page.goto('/profile');
  await page.fill('input[placeholder*="Project ID"]', 'TEST-001');
  await page.fill('input[placeholder*="Project Name"]', 'Test Project');
  await page.fill('textarea[placeholder*="Description"]', 'Test description');
  await expect(page.locator('.create-project-section')).toHaveScreenshot('dashboard-create-form.png');
});
