// e2e/auth-routing.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication and Protected Routes', () => {

  test('Scenario 3: Intercepts unauthenticated navigation and redirects after login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/saved');
    await expect(page).toHaveURL(/.*login/); 

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

    await page.getByLabel('Email').fill('test@test.com');
    await page.getByLabel('Password').fill('testtest');
    
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page).toHaveURL(/.*saved/);
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible(); 
  });

});