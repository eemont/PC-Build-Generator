// e2e/auth-routing.spec.js
import { test, expect } from '@playwright/test';

test.describe('Scenario 3: Intercepts unauthenticated navigation', () => {
    
    test.use({ storageState: { cookies: [], origins: [] } }); 

    test('redirects after login', async ({ page }) => {
      await page.goto('/saved');
      await expect(page).toHaveURL(/.*login/);
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    });

});