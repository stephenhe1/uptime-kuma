import { test, expect } from "@playwright/test";

/**
 * Tests for Setup pages - /setup and /setup-database
 * These pages render independently (no socket.io required for rendering).
 */

test.describe("Setup Page (/setup)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/setup", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("URL stays at /setup", async ({ page }) => {
        await expect(page).toHaveURL("/setup");
    });

    test("shows Uptime Kuma heading", async ({ page }) => {
        await expect(page.getByText("Uptime Kuma")).toBeVisible();
    });

    test("shows 'Create your admin account' text", async ({ page }) => {
        await expect(page.getByText("Create your admin account")).toBeVisible();
    });

    test("shows language selector", async ({ page }) => {
        const languageSelect = page.locator("#language");
        await expect(languageSelect).toBeVisible();
        // Verify it has English option
        await expect(languageSelect.locator("option[value='en']")).toBeAttached();
    });

    test("shows username input", async ({ page }) => {
        const usernameInput = page.locator("[data-cy='username-input']");
        await expect(usernameInput).toBeVisible();
        await expect(usernameInput).toHaveAttribute("type", "text");
        await expect(usernameInput).toHaveAttribute("required", "");
    });

    test("shows password input", async ({ page }) => {
        const passwordInput = page.locator("[data-cy='password-input']");
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toHaveAttribute("type", "password");
        await expect(passwordInput).toHaveAttribute("required", "");
    });

    test("shows repeat password input", async ({ page }) => {
        const repeatInput = page.locator("[data-cy='password-repeat-input']");
        await expect(repeatInput).toBeVisible();
        await expect(repeatInput).toHaveAttribute("type", "password");
        await expect(repeatInput).toHaveAttribute("required", "");
    });

    test("shows Create submit button", async ({ page }) => {
        const submitBtn = page.locator("[data-cy='submit-setup-form']");
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toHaveAttribute("type", "submit");
        await expect(submitBtn).toContainText("Create");
    });

    test("username input is editable", async ({ page }) => {
        const usernameInput = page.locator("[data-cy='username-input']");
        await usernameInput.fill("testadmin");
        await expect(usernameInput).toHaveValue("testadmin");
    });

    test("password inputs are editable", async ({ page }) => {
        const passwordInput = page.locator("[data-cy='password-input']");
        await passwordInput.fill("secret123");
        await expect(passwordInput).toHaveValue("secret123");

        const repeatInput = page.locator("[data-cy='password-repeat-input']");
        await repeatInput.fill("secret123");
        await expect(repeatInput).toHaveValue("secret123");
    });

    test("form has data-cy setup-form attribute", async ({ page }) => {
        await expect(page.locator("[data-cy='setup-form']")).toBeVisible();
    });

    test("form submits (socket will fail, but browser validation triggers)", async ({ page }) => {
        // Click submit without filling form - browser should show required validation
        const submitBtn = page.locator("[data-cy='submit-setup-form']");
        await submitBtn.click();
        // Username input should be invalid (required)
        const usernameInput = page.locator("[data-cy='username-input']");
        const isValid = await usernameInput.evaluate((el) => el.validity.valid);
        expect(isValid).toBe(false);
    });

    test("language selector changes language", async ({ page }) => {
        const languageSelect = page.locator("#language");
        // Select English explicitly
        await languageSelect.selectOption("en");
        await expect(page.getByText("Create your admin account")).toBeVisible();
    });
});

test.describe("Setup Database Page (/setup-database)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/setup-database", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("URL stays at /setup-database", async ({ page }) => {
        await expect(page).toHaveURL("/setup-database");
    });

    test("shows database selection question", async ({ page }) => {
        await expect(
            page.getByText("Which database would you like to use?")
        ).toBeVisible();
    });

    test("shows SQLite database option", async ({ page }) => {
        await expect(page.getByText("SQLite")).toBeVisible();
        const sqliteRadio = page.locator("#btnradio1");
        await expect(sqliteRadio).toBeAttached();
    });

    test("shows MariaDB/MySQL database option", async ({ page }) => {
        await expect(page.getByText("MariaDB/MySQL")).toBeVisible();
        const mariadbRadio = page.locator("#btnradio2");
        await expect(mariadbRadio).toBeAttached();
    });

    test("shows Next button", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    });

    test("shows language selector", async ({ page }) => {
        const languageSelect = page.locator("#language");
        await expect(languageSelect).toBeVisible();
    });

    test("database option labels are visible and clickable", async ({
        page,
    }) => {
        // Bootstrap btn-check uses labels as the click target (radio inputs are visually hidden)
        // Labels are <label for="btnradioN"> elements with Bootstrap btn styles
        const sqliteLabel = page.locator('label[for="btnradio1"]');
        const mariadbLabel = page.locator('label[for="btnradio2"]');

        await expect(sqliteLabel).toBeVisible();
        await expect(mariadbLabel).toBeVisible();

        // Click the MariaDB/MySQL label - should check the corresponding radio
        await mariadbLabel.click();
        const mariadbRadio = page.locator("#btnradio2");
        await expect(mariadbRadio).toBeChecked();

        // Click the SQLite label - should check SQLite radio
        await sqliteLabel.click();
        const sqliteRadio = page.locator("#btnradio1");
        await expect(sqliteRadio).toBeChecked();
    });
});
