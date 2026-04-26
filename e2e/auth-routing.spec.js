import { test, expect } from '@playwright/test';

test.describe('Authentication and Protected Routes', () => {

  test('Scenario 3: Intercepts unauthenticated navigation and redirects after login', async ({ page }) => {
    await page.context().clearCookies();
    
    await page.goto('/saved');

    await expect(page).toHaveURL(/.*auth/);
    
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    await page.getByPlaceholder('Email').fill('testuser@example.com');
    await page.getByPlaceholder('Password').fill('TestPassword123!');
    await page.getByRole('button', { name: 'Login', exact: true }).click();

    await expect(page).toHaveURL(/.*saved/);
    
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

});