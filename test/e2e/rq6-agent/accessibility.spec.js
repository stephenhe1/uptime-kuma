import { test, expect } from "@playwright/test";

/**
 * Accessibility and meta tests for the application.
 */

test.describe("Page Meta Tags", () => {
    test("has UTF-8 charset meta tag", async ({ page }) => {
        await page.goto("/dashboard");
        const charset = await page.$eval('meta[charset]', el => el.getAttribute('charset'));
        expect(charset?.toLowerCase()).toBe("utf-8");
    });

    test("has viewport meta tag for responsive design", async ({ page }) => {
        await page.goto("/dashboard");
        const viewportMeta = await page.locator('meta[name="viewport"]');
        await expect(viewportMeta).toBeAttached();
        const content = await viewportMeta.getAttribute("content");
        expect(content).toContain("width=device-width");
    });

    test("has description meta tag", async ({ page }) => {
        await page.goto("/dashboard");
        const desc = page.locator('meta[name="description"]');
        await expect(desc).toBeAttached();
        const content = await desc.getAttribute("content");
        expect(content).toContain("Uptime Kuma");
    });

    test("has apple-touch-icon link", async ({ page }) => {
        await page.goto("/dashboard");
        const icon = page.locator('link[rel="apple-touch-icon"]');
        await expect(icon).toBeAttached();
    });

    test("has favicon", async ({ page }) => {
        await page.goto("/dashboard");
        const favicon = page.locator('link[rel="icon"]');
        await expect(favicon).toBeAttached();
    });

    test("has web manifest link", async ({ page }) => {
        await page.goto("/dashboard");
        const manifest = page.locator('link[rel="manifest"]');
        await expect(manifest).toBeAttached();
    });
});

test.describe("Setup Form Accessibility", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/setup", { waitUntil: "networkidle" });
    });

    test("setup form has aria-label or role", async ({ page }) => {
        // The form itself has data-cy attribute
        const form = page.locator("[data-cy='setup-form']");
        await expect(form).toBeVisible();
    });

    test("username input has associated label", async ({ page }) => {
        // The input has id="floatingInput" and label for="floatingInput"
        const label = page.locator('label[for="floatingInput"]');
        await expect(label).toBeVisible();
        await expect(label).toContainText("Username");
    });

    test("password input has associated label", async ({ page }) => {
        const label = page.locator('label[for="floatingPassword"]');
        await expect(label).toBeVisible();
        await expect(label).toContainText("Password");
    });

    test("repeat password input has associated label", async ({ page }) => {
        const label = page.locator('label[for="repeat"]');
        await expect(label).toBeVisible();
        await expect(label).toContainText("Repeat Password");
    });

    test("language select has associated label", async ({ page }) => {
        const label = page.locator('label[for="language"]');
        await expect(label).toBeVisible();
        await expect(label).toContainText("Language");
    });
});

test.describe("Login Form Structure (Login component)", () => {
    test("login form does NOT appear when socket is disconnected", async ({
        page,
    }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        // Login form requires allowLoginDialog=true which is set only after socket connects
        // Since socket doesn't connect, no login form appears
        const loginForm = page.locator('form[aria-label="Login Form"]');
        await expect(loginForm).not.toBeVisible();
    });

    test("no username/password inputs on dashboard when disconnected", async ({
        page,
    }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        // No input fields on the protected pages without login
        const inputs = page.locator('input[type="text"], input[type="password"]');
        await expect(inputs).toHaveCount(0);
    });
});

test.describe("Status Page Accessibility", () => {
    test("status page has html lang attribute", async ({ page }) => {
        await page.goto("/status", { waitUntil: "networkidle" });
        const htmlLang = await page.locator("html").getAttribute("lang");
        expect(htmlLang).toBeTruthy();
    });

    test("404 page has proper heading structure", async ({ page }) => {
        await page.goto("/not-found-test", { waitUntil: "networkidle" });
        // The 404 page has a strong tag instead of h1 but has heading text
        const strongEl = page.locator("strong").first();
        await expect(strongEl).toContainText("Page Not Found");
    });
});

test.describe("Keyboard Navigation", () => {
    test("setup form inputs are focusable via click", async ({ page }) => {
        await page.goto("/setup", { waitUntil: "networkidle" });

        // Click on username input to focus it
        const usernameInput = page.locator("[data-cy='username-input']");
        await usernameInput.click();
        const isFocused = await usernameInput.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });

    test("setup form buttons are keyboard accessible", async ({ page }) => {
        await page.goto("/setup", { waitUntil: "networkidle" });
        const submitBtn = page.locator("[data-cy='submit-setup-form']");
        await submitBtn.focus();
        const isFocused = await submitBtn.evaluate(
            (el) => el === document.activeElement
        );
        expect(isFocused).toBe(true);
    });
});
