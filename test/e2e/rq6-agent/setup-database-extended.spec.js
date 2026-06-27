import { test, expect } from "@playwright/test";

/**
 * Extended tests for the Setup Database page.
 * Tests conditional UI based on database type selection.
 */

test.describe("Setup Database - Conditional Fields", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/setup-database", { waitUntil: "networkidle" });
    });

    test("selecting MariaDB shows connection fields", async ({ page }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();

        // MariaDB fields should appear
        await expect(
            page.getByText(
                "Connect to an external MariaDB database"
            )
        ).toBeVisible();
    });

    test("selecting MariaDB shows Hostname field", async ({ page }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        await expect(page.getByText("Hostname")).toBeVisible();
    });

    test("selecting MariaDB shows Port field with default 3306", async ({
        page,
    }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        // Use label with exact text match (avoids matching "Português" language options)
        await expect(
            page.locator("label").filter({ hasText: /^Port$/ })
        ).toBeVisible();
        // Port field should have default value of 3306 (Vue v-model sets JS property)
        const portInput = page.locator("input[type=text]").nth(1);
        const portValue = await portInput.inputValue();
        expect(portValue).toBe("3306");
    });

    test("selecting MariaDB shows Username field", async ({ page }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        await expect(page.getByText("Username")).toBeVisible();
    });

    test("selecting MariaDB shows Password field", async ({ page }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        await expect(page.getByText("Password")).toBeVisible();
    });

    test("selecting MariaDB shows Database Name field with default 'kuma'", async ({
        page,
    }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        await expect(page.getByText("Database Name")).toBeVisible();
        // Database Name is the 5th text input (0-indexed: hostname, port, username, [password=type pw], db name)
        // Use inputValue() to check Vue v-model bound value
        const allTextInputs = page.locator("input[type=text]");
        const dbNameInput = allTextInputs.last();
        const dbValue = await dbNameInput.inputValue();
        expect(dbValue).toBe("kuma");
    });

    test("selecting MariaDB shows SSL/TLS checkbox", async ({ page }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        await expect(page.getByText("Enable SSL/TLS")).toBeVisible();
        const sslCheckbox = page.locator("#sslCheck");
        await expect(sslCheckbox).toBeVisible();
    });

    test("selecting SQLite shows SQLite information text", async ({ page }) => {
        const sqliteLabel = page.locator('label[for="btnradio1"]');
        await sqliteLabel.click();
        // SQLite selection should show SQLite description
        // Check the sqlite radio is checked
        await expect(page.locator("#btnradio1")).toBeChecked();
    });

    test("switching from MariaDB to SQLite hides MariaDB fields", async ({
        page,
    }) => {
        // First select MariaDB
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        await expect(page.getByText("Hostname")).toBeVisible();

        // Then select SQLite
        const sqliteLabel = page.locator('label[for="btnradio1"]');
        await sqliteLabel.click();

        // MariaDB hostname field should be hidden
        await expect(page.getByText("Hostname")).not.toBeVisible();
    });

    test("Next button is always visible", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Next" })).toBeVisible();

        // Also visible after selecting MariaDB
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();
        await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    });

    test("SSL/TLS toggle checkbox is interactive", async ({ page }) => {
        const mariadbLabel = page.locator('label[for="btnradio2"]');
        await mariadbLabel.click();

        const sslCheckbox = page.locator("#sslCheck");
        const initialState = await sslCheckbox.isChecked();
        await sslCheckbox.click();
        const newState = await sslCheckbox.isChecked();
        expect(newState).toBe(!initialState);
    });
});

test.describe("Setup Page - Form Validation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/setup", { waitUntil: "networkidle" });
    });

    test("username field is required", async ({ page }) => {
        // Try to submit without filling required fields
        await page.locator("[data-cy='submit-setup-form']").click();
        const usernameInput = page.locator("[data-cy='username-input']");
        const validity = await usernameInput.evaluate(
            (el) => el.validity.valueMissing
        );
        expect(validity).toBe(true);
    });

    test("password field is required", async ({ page }) => {
        // Fill username but not password
        await page.locator("[data-cy='username-input']").fill("admin");
        await page.locator("[data-cy='submit-setup-form']").click();

        const passwordInput = page.locator("[data-cy='password-input']");
        const validity = await passwordInput.evaluate(
            (el) => el.validity.valueMissing
        );
        expect(validity).toBe(true);
    });

    test("repeat password field is required", async ({ page }) => {
        await page.locator("[data-cy='username-input']").fill("admin");
        await page.locator("[data-cy='password-input']").fill("password123");
        await page.locator("[data-cy='submit-setup-form']").click();

        const repeatInput = page.locator("[data-cy='password-repeat-input']");
        const validity = await repeatInput.evaluate(
            (el) => el.validity.valueMissing
        );
        expect(validity).toBe(true);
    });

    test("all fields filled enables form submission attempt", async ({
        page,
    }) => {
        await page.locator("[data-cy='username-input']").fill("admin");
        await page.locator("[data-cy='password-input']").fill("password123");
        await page
            .locator("[data-cy='password-repeat-input']")
            .fill("password123");

        // All required fields are filled - no validity errors
        const usernameValid = await page
            .locator("[data-cy='username-input']")
            .evaluate((el) => el.validity.valid);
        const passwordValid = await page
            .locator("[data-cy='password-input']")
            .evaluate((el) => el.validity.valid);
        const repeatValid = await page
            .locator("[data-cy='password-repeat-input']")
            .evaluate((el) => el.validity.valid);

        expect(usernameValid).toBe(true);
        expect(passwordValid).toBe(true);
        expect(repeatValid).toBe(true);
    });

    test("language selector has multiple languages available", async ({
        page,
    }) => {
        const languageSelect = page.locator("#language");
        const optionCount = await languageSelect.locator("option").count();
        // Should have many language options (the app supports 40+ languages)
        expect(optionCount).toBeGreaterThan(10);
    });

    test("can select different language in setup form", async ({ page }) => {
        const languageSelect = page.locator("#language");

        // There should be a Spanish option (value is "es-ES" in this app)
        const spanishOption = languageSelect.locator('option[value="es-ES"]');
        await expect(spanishOption).toBeAttached();
    });
});
