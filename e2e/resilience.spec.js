// e2e/resilience.spec.js
import { test, expect } from '@playwright/test';

test.describe('Resilience and Fault Injection', () => {

//   // Check for hidden alerts
//   test.beforeEach(async ({ page }) => {
//     page.on('dialog', dialog => {
//       console.log('\n🚨 HIDDEN ALERT TRIGGERED:', dialog.message(), '\n');
//     });
//   });

  test('Fault Injection 1: Gracefully handles 500 Internal Server Errors', async ({ page }) => {
    await page.goto('/build');

    await page.route('**/rest/v1/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Simulated Server Crash' }),
      });
    });

    await page.locator('#budget').fill('1500');
    const generateBtn = page.getByRole('button', { name: 'Generate', exact: true });
    await generateBtn.click();

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Failed to generate build/i);
    
    await expect(generateBtn).toBeEnabled();
  });


  test('Fault Injection 2: Maintains stable UI during extreme network latency', async ({ page }) => {
    await page.goto('/build');

    await page.route('**/rest/v1/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      await route.continue();
    });

    await page.locator('#budget').fill('1500');
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    const generatingBtn = page.getByRole('button', { name: 'Generating…' });
    await expect(generatingBtn).toBeVisible();
    await expect(generatingBtn).toBeDisabled();

    await expect(page).toHaveURL(/.*custom-build/, { timeout: 10000 });
  });


  test('Fault Injection 3: Survives corrupted or malformed database responses', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Password').fill('testtest');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();

    await page.route('**/rest/v1/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 999,
            build_name: null,
            total_price: undefined,
          }
        ]),
      });
    });

    await page.getByRole('link', { name: 'Saved Builds', exact: true }).click();
    await expect(page).toHaveURL(/.*saved/);

    await expect(page.getByRole('heading', { name: 'Saved Builds' })).toBeVisible();
    
    await expect(page.locator('.saved-card').first()).toBeVisible(); 
  });


  test('Fault Injection 4: Alerts user when network drops mid-operation', async ({ page, context }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Password').fill('testtest');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    await page.getByRole('link', { name: 'Build Your PC' }).click();
    await expect(page).toHaveURL(/.*build/);
    await page.getByRole('button', { name: 'Create Your Own' }).click();
    await expect(page).toHaveURL(/.*custom-build/);

    await page.getByRole('button', { name: '+ Pick CPU', exact: true }).click();
    await page.locator('.picker-item').first().click();

    await page.getByPlaceholder('Name your custom build...').fill('Offline Test Build');

    const dialogPromise = page.waitForEvent('dialog');

    await context.setOffline(true);

    await page.getByRole('button', { name: 'Save Build' }).click();

    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Failed to save build');
    await dialog.accept();
    
    await context.setOffline(false);
  });

});