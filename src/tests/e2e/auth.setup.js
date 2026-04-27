// src/tests/e2e/auth.setup.js
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/session.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel('Email').fill('test@test.com');
  await page.getByLabel('Password').fill('testtest');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});