// e2e/generate-flow.spec.js
import { test, expect } from '@playwright/test';

test.describe('Generate Build Flow & Validation', () => {

  test('Scenario 4: Rejects invalid budget boundary and prevents API call', async ({ page }) => {
    let apiCalled = false;
    await page.route('**/rest/v1/pc_parts*', async (route) => {
      apiCalled = true;
      await route.continue();
    });

    await page.goto('/build'); 

    const budgetInput = page.locator('#budget');
    const generateBtn = page.getByRole('button', { name: 'Generate', exact: true }); 

    await budgetInput.fill('-50');
    await generateBtn.click();

    expect(apiCalled).toBe(false);
    await expect(page.getByText(/Budget out of bounds/i)).toBeVisible();

    await budgetInput.fill('800');
    await generateBtn.click();
    await expect(page.getByText(/Budget out of bounds/i)).toBeHidden();
  });

  test('Scenario 1: Auto-generates a build and persists it to Saved Builds', async ({ page }) => {
    await page.goto('/build');
    await expect(page).toHaveURL(/.*build/);

    await page.locator('#budget').fill('1500');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    await expect(page.locator('.parts-table')).toBeVisible({ timeout: 30000 });

    await page.getByRole('button', { name: 'Save Build' }).click();
    await page.getByRole('link', { name: 'Saved Builds' }).click();
    await expect(page).toHaveURL(/.*saved/);
    await expect(page.getByText('$1,500 Build').first()).toBeVisible();
  });

});