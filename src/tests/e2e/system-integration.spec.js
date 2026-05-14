// e2e/system-integration.spec.js
import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('System Integration Tests', () => {

//   // Check for hidden alerts
//   test.beforeEach(async ({ page }) => {
//     page.on('dialog', dialog => {
//       console.log('\n🚨 HIDDEN ALERT TRIGGERED:', dialog.message(), '\n');
//     });
//   });

  test('Database Read/Write Verification: Saves Custom Build and verifies exact parts on retrieval', async ({ page }) => {
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
    await page.locator('.picker-item').filter({ hasText: /Ryzen/i }).first().click();

    await page.getByRole('button', { name: '+ Pick Motherboard', exact: true }).click();
    await page.locator('.picker-item').filter({ hasText: /B650/i }).first().click();

    await page.getByPlaceholder('Name your custom build...').fill('Integration Test Build');
    await page.getByRole('button', { name: 'Save Build' }).click();

    await expect(page).toHaveURL(/.*saved/);

    await expect(page.getByText(/Ryzen/i).first()).toBeVisible();
    await expect(page.getByText(/B650/i).first()).toBeVisible();
  });

  test('Routing State Verification: SPA navigation persists AuthContext without hard reloads', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Password').fill('testtest');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();

    await page.evaluate(() => { window.hasHardReloaded = false; });

    await page.getByRole('link', { name: 'FAQ' }).click();
    await expect(page).toHaveURL(/.*faq/);

    await page.getByRole('link', { name: 'Build Your PC' }).click();
    await expect(page).toHaveURL(/.*build/);

    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();

    const hardReloadTracker = await page.evaluate(() => window.hasHardReloaded);
    expect(hardReloadTracker).toBe(false);
  });

  test('Security Integration: Multi-User Data Isolation', async ({ page }) => {
    const uniqueBuildName = `Top Secret Build ${Date.now()}`;

    // --- USER A FLOW ---
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
    
    await page.getByPlaceholder('Name your custom build...').fill(uniqueBuildName);
    await page.getByRole('button', { name: 'Save Build' }).click();
    
    await expect(page).toHaveURL(/.*saved/);
    await expect(page.getByText(uniqueBuildName)).toBeVisible();

    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page).toHaveURL(/.*login/); 

    // --- USER B FLOW ---
    await page.getByLabel('Email').fill('jamesruiz21@yahoo.com');
    await page.getByLabel('Password').fill('Apples123$');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    await page.getByRole('link', { name: 'Saved Builds' }).click();
    await expect(page).toHaveURL(/.*saved/);
    
    await expect(page.getByText(uniqueBuildName)).toBeHidden();
  });

  test('CRUD Integration: Full Data Lifecycle (Create & Delete with persistence)', async ({ page }) => {
    const buildName = `Ephemeral Build ${Date.now()}`;

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
    
    await page.getByPlaceholder('Name your custom build...').fill(buildName);
    await page.getByRole('button', { name: 'Save Build' }).click();
    
    await expect(page).toHaveURL(/.*saved/);

    const newBuildCard = page.locator('.saved-card').filter({ hasText: buildName });
    await expect(newBuildCard).toBeVisible();

    page.on('dialog', dialog => dialog.accept());

    await newBuildCard.getByRole('button', { name: 'Delete' }).click();

    await expect(newBuildCard).toBeHidden();

    await page.reload();
    await expect(newBuildCard).toBeHidden();
  });

});