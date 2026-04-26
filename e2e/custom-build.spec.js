import { test, expect } from '@playwright/test';

test.describe('Custom Build Compatibility Logic', () => {

  test('Scenario 2: Renders and resolves PartIssue warning on incompatible selection', async ({ page }) => {
    await page.goto('/custom');

    const cpuSlot = page.locator('.component-slot').filter({ hasText: 'CPU' });
    const moboSlot = page.locator('.component-slot').filter({ hasText: 'MOTHERBOARD' });

    await cpuSlot.locator('select')

    await moboSlot.locator('select').selectOption({ label: 'ASUS Prime Z790-P' }); 

    const warningBanner = page.locator('.part-issue'); 
    await expect(warningBanner).toBeVisible();
    await expect(warningBanner).toContainText(/Socket Mismatch/i);

    
    await moboSlot.locator('select').selectOption({ label: 'MSI PRO B650-P' }); 

    await expect(warningBanner).toBeHidden();
  });

});