import { test, expect } from "@playwright/test";

/**
 * Tests for public pages that don't require socket.io:
 * /status-page, /status, /status/:slug
 */

test.describe("Status Page (/status-page)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/status-page", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("URL stays at /status-page", async ({ page }) => {
        await expect(page).toHaveURL("/status-page");
    });

    test("page loads without error (no socket error banner)", async ({ page }) => {
        // Status pages are in noSocketIOPages list so no socket error banner
        const errorBanner = page.getByText(
            "Cannot connect to the socket server"
        );
        await expect(errorBanner).not.toBeVisible();
    });

    test("renders page content area", async ({ page }) => {
        // The status page loads - body should have content
        const body = page.locator("body");
        await expect(body).toBeAttached();
    });
});

test.describe("Status Route (/status)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/status", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("URL stays at /status", async ({ page }) => {
        await expect(page).toHaveURL("/status");
    });

    test("page loads without socket error banner", async ({ page }) => {
        const errorBanner = page.getByText(
            "Cannot connect to the socket server"
        );
        await expect(errorBanner).not.toBeVisible();
    });
});

test.describe("Status Page by Slug (/status/:slug)", () => {
    test("loads a non-existent status page slug gracefully", async ({
        page,
    }) => {
        await page.goto("/status/nonexistent-slug-12345", {
            waitUntil: "networkidle",
        });
        await expect(page).toHaveTitle(/Uptime Kuma/);
        // Should render without crashing (either shows empty state or not found)
        const body = page.locator("body");
        await expect(body).toBeAttached();
    });

    test("URL contains the slug", async ({ page }) => {
        await page.goto("/status/my-test-status-page", {
            waitUntil: "networkidle",
        });
        await expect(page).toHaveURL("/status/my-test-status-page");
    });
});

test.describe("404 - Page Not Found", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/this-route-does-not-exist-xyz", {
            waitUntil: "networkidle",
        });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("shows Page Not Found text", async ({ page }) => {
        await expect(page.getByText("Page Not Found")).toBeVisible();
    });

    test("shows helpful error causes", async ({ page }) => {
        await expect(
            page.getByText("The resource is no longer available")
        ).toBeVisible();
    });

    test("shows navigation options", async ({ page }) => {
        // Should have links to go back or return home
        await expect(
            page.getByRole("link", { name: /home page/i })
        ).toBeVisible();
    });

    test("shows Uptime Kuma branding (emoji bear)", async ({ page }) => {
        // The 404 page shows a bear emoji
        const pageContent = await page.innerText("body");
        expect(pageContent).toContain("🐻");
    });
});
