import { test, expect } from "@playwright/test";

test.describe("E2E Test - Create Compatible PC Build", () => {

    test("Create build that is mostly or fully compatible and save", async ({ page }) => {
        await page.goto('/');

        const signInBtn = page.getByRole("button", { name: /sign in/i });
        await expect(signInBtn).not.toBeVisible();
        
        await page.getByRole("link", { name: /build your pc/i }).click();
        await expect(page).toHaveURL('/build');

        await page.getByRole("button", { name: /create your own/i }).click();
        await expect(page).toHaveURL('/custom-build');

        const partsToSearch = ["motherboard", 'cpu', 'cpu cooler', 'memory', 'storage', 'gpu', 'power supply', 'case'];
        for (const partStr of partsToSearch) {
            const nameMatch = new RegExp(`.*${partStr}$`, 'i');
            await page.getByRole("button", { name: nameMatch }).click();
            await page.locator('div.picker-list').waitFor({ state: 'visible' });
            
            await page.locator('div.picker-list div.picker-item').first().waitFor();
            const parts = await page.locator("div.picker-list div.picker-item").all();
            expect(parts.length).toBeGreaterThan(0);

            let partSelected = false;
            for (const part of parts) {
                const issueExists = await part.locator('div.picker-item-compatibility div.issue-container').isVisible();
                if (!issueExists) {
                    await part.getByRole("button", { name: /add/i }).click();
                    partSelected = true;
                    break;
                }
            }

            if (!partSelected) {
                await parts[0].getByRole("button", { name: /add/i }).click();
            }
        }

        await page.locator('textarea.build-notes-input').fill("this is a pc build from testing e2e capabilities. this build will be or be close to fully compatible");

        const name = `Most Compatible ${new Date().toLocaleString()}`;
        await page.locator("input.build-name-input").fill(name);
        await page.locator("button.btn-save-build").click();

        await expect(page).toHaveURL("/saved");
        const createdBuild = page.getByRole("heading", { level: 2, name });
        await expect(createdBuild).toBeDefined();
    });
});