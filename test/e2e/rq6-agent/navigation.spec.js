import { test, expect } from "@playwright/test";

/**
 * Tests for navigation flows and routing behavior.
 */

test.describe("Entry Point Navigation", () => {
    test("/ redirects to /dashboard", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        // The entry page makes an API call and redirects
        await expect(page).toHaveURL("/dashboard");
    });

    test("/ has correct page title", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });
});

test.describe("Route Navigation", () => {
    test("navigating to /setup loads setup form", async ({ page }) => {
        await page.goto("/setup", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/setup");
        await expect(page.getByText("Create your admin account")).toBeVisible();
    });

    test("navigating to /setup-database loads database form", async ({
        page,
    }) => {
        await page.goto("/setup-database", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/setup-database");
        await expect(
            page.getByText("Which database would you like to use?")
        ).toBeVisible();
    });

    test("navigating to /dashboard shows dashboard page", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/dashboard");
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("navigating to /list shows list page", async ({ page }) => {
        await page.goto("/list", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/list");
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("navigating to /add shows add monitor page", async ({ page }) => {
        await page.goto("/add", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/add");
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("navigating to /maintenance shows maintenance page", async ({
        page,
    }) => {
        await page.goto("/maintenance", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/maintenance");
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("navigating to /manage-status-page shows status page manager", async ({
        page,
    }) => {
        await page.goto("/manage-status-page", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/manage-status-page");
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("navigating to /settings/general shows settings page", async ({
        page,
    }) => {
        await page.goto("/settings/general", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/settings/general");
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("navigating to /status shows public status page", async ({ page }) => {
        await page.goto("/status", { waitUntil: "networkidle" });
        await expect(page).toHaveURL("/status");
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("navigating to unknown route shows 404", async ({ page }) => {
        await page.goto("/completely-unknown-route-abc", {
            waitUntil: "networkidle",
        });
        await expect(page.getByText("Page Not Found")).toBeVisible();
    });
});

test.describe("404 Page Navigation", () => {
    test("'Go back to home page' link points to /", async ({ page }) => {
        await page.goto("/nonexistent", { waitUntil: "networkidle" });
        const homeLink = page.getByRole("link", { name: /home page/i });
        await expect(homeLink).toHaveAttribute("href", "/");
    });

    test("clicking 'Go back to home page' navigates to / (then /dashboard)", async ({
        page,
    }) => {
        await page.goto("/nonexistent", { waitUntil: "networkidle" });
        const homeLink = page.getByRole("link", { name: /home page/i });
        await homeLink.click();
        await page.waitForLoadState("networkidle");
        // Entry page redirects to /dashboard
        await expect(page).toHaveURL("/dashboard");
    });

    test("404 page shows Uptime Kuma header link", async ({ page }) => {
        await page.goto("/nonexistent", { waitUntil: "networkidle" });
        const headerLink = page.getByRole("link", { name: "Uptime Kuma" });
        await expect(headerLink).toBeVisible();
    });
});

test.describe("App Branding", () => {
    const pages = [
        "/setup",
        "/setup-database",
        "/dashboard",
        "/list",
        "/settings/general",
        "/status",
    ];

    for (const route of pages) {
        test(`'${route}' shows Uptime Kuma title`, async ({ page }) => {
            await page.goto(route, { waitUntil: "networkidle" });
            await expect(page).toHaveTitle(/Uptime Kuma/);
        });
    }
});
