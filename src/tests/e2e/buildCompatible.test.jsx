import { test, expect } from "@playwright/test";

test.use({ storageState: 'playwright/.auth/session.json' });

test.describe("E2E Test - Create Compatible PC Build", () => {
    
    test("Navigate to login and sign in user", async ({ page }) => {  
              
        await page.goto("/");
        await page.evaluate(() => window.localStorage.clear());   // clear session to reauthenticate

        // if window size smaller, then need to open mobile nav menu to see login button
        const menuButton = page.locator("button.menu-toggle");
        if (await menuButton.isVisible()) {
            await menuButton.click();
        }

        const loginButton = await page.getByRole('link', { name: /join now/i  });
        await loginButton.click();

        await expect(page).toHaveURL('/login');

        // fill in login form and submit
        const emailInput = await page.getByRole("textbox", { name: /email/i });
        await emailInput.fill("test@test.com");

        const passwordInput = await page.getByRole("textbox", { name: /password/i });
        await passwordInput.fill("testtest");

        const submitBtn = await page.getByRole("button", { name: /sign in/i });
        await submitBtn.click();

        await expect(page).toHaveURL("/");

        // save session
        await page.context().storageState({ path: "playwright/.auth/session.json" });
    });

    test("Create build that is mostly or fully compatible and save", async ({ page }) => {
        await page.goto('/');

        const signInBtn = await page.getByRole("button", { name: /sign in/i });
        await expect(await signInBtn.isVisible()).toBeFalsy();
        
        const buildPcBtn = await page.getByRole("link", { name: /build your pc/i });
        await buildPcBtn.click();

        await expect(page).toHaveURL('/build');

        const customBuildBtn = await page.getByRole("button", { name: /create your own/i });
        await customBuildBtn.click();

        await expect(page).toHaveURL('/custom-build');

        // select parts
        const partsToSearch = ["motherboard", 'cpu', 'cpu cooler', 'memory', 'storage', 'gpu', 'power supply', 'case'];
        for (const partStr of partsToSearch) {
            const nameMatch = new RegExp(`.*${partStr}$`, 'i');
            const selectPartBtn = await page.getByRole("button", { name: nameMatch });

            await selectPartBtn.click();
            await page.locator('div.picker-list').waitFor({ state: 'visible'});
            const pickerList = await page.locator('div.picker-list');
            
            await pickerList.locator('div.picker-item').first().waitFor();
            const parts = await pickerList.locator("div.picker-item").all();
            expect(parts.length).toBeGreaterThan(0);

            for (const part of parts) {
                const issueExists = await part.locator('div.picker-item-compatibility div.issue-container').isVisible();
                if (!issueExists) {
                    const addPartBtn = await part.getByRole("button", { name: /add/i });
                    await addPartBtn.click();
                    break;
                } 
            }

            // click first part if none compatible
            if (await page.locator('div.picker-list').isVisible()) {
                const addFirstPart = await parts[0].getByRole("button", { name: /add/i });
                await addFirstPart.click();
            }
        }


        // add build notes + name and save build
        const buildNotes = await page.locator('textarea.build-notes-input');
        await buildNotes.fill("this is a pc build from testing e2e capabilities. this build will be or be close to fully compatible");

        const buildName = await page.locator("input.build-name-input");
        const name = `Most Compatible ${new Date().toLocaleString()}`
        await buildName.fill(name);

        const saveBuild = await page.locator("button.btn-save-build");
        await saveBuild.click();

        await expect(page).toHaveURL("/saved");
        const createdBuild = await page.getByRole("header", { level: 2, name });
        await expect(createdBuild).toBeDefined();
    });
});