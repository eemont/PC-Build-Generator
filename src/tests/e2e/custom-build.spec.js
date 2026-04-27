// e2e/custom-build.spec.js
import { test, expect } from '@playwright/test';

test.describe('Custom Build Compatibility Logic', () => {

  test('Scenario 2: Renders and resolves PartIssue warning on incompatible selection', async ({ page }) => {
    await page.goto('/custom-build'); 

    await page.getByRole('button', { name: '+ Pick CPU', exact: true }).click();
    await page.locator('.picker-item').filter({ hasText: /Ryzen 5/i }).first().click();

    await page.getByRole('button', { name: '+ Pick Motherboard', exact: true }).click();
    await page.locator('.picker-item').filter({ hasText: /Z790/i }).first().click();

    const warningText = page.locator('.col-compatibility-msg').filter({ hasText: /severe compatibility errors/i }).first();
    await expect(warningText).toBeVisible();

    await page.getByRole('button', { name: '✎' }).nth(1).click(); 
    await page.locator('.picker-item').filter({ hasText: /B650/i }).first().click(); 
    
    await expect(warningText).toBeHidden();
  });

});