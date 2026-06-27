import { test, expect } from "@playwright/test";

/**
 * Tests for Dashboard and Monitor pages.
 * Note: These pages require socket.io connection. In the current dev setup,
 * the socket cannot connect to its backend, so the connection error banner
 * is displayed. Tests verify the error-state UI and page rendering.
 */

test.describe("Dashboard Page (/dashboard)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("shows socket connection error banner", async ({ page }) => {
        await expect(
            page.getByText("Cannot connect to the socket server")
        ).toBeVisible();
    });

    test("shows error message with reconnecting text", async ({ page }) => {
        await expect(page.getByText("Reconnecting...")).toBeVisible();
    });

    test("shows reverse proxy guide link", async ({ page }) => {
        await expect(
            page.getByText("Using a Reverse Proxy?")
        ).toBeVisible();
        await expect(
            page.getByRole("link", {
                name: "Check how to config it for WebSocket",
            })
        ).toBeVisible();
    });

    test("reverse proxy guide link points to wiki", async ({ page }) => {
        const link = page.getByRole("link", {
            name: "Check how to config it for WebSocket",
        });
        await expect(link).toHaveAttribute(
            "href",
            /github\.com\/louislam\/uptime-kuma\/wiki\/Reverse-Proxy/
        );
    });

    test("shows Uptime Kuma title link", async ({ page }) => {
        await expect(
            page.getByRole("link", { name: "Uptime Kuma" })
        ).toBeVisible();
    });

    test("Uptime Kuma title link points to /dashboard", async ({ page }) => {
        const link = page.getByRole("link", { name: "Uptime Kuma" });
        await expect(link).toHaveAttribute("href", "/dashboard");
    });
});

test.describe("Monitor List Page (/list)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/list", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("shows socket connection error", async ({ page }) => {
        await expect(
            page.getByText("Cannot connect to the socket server")
        ).toBeVisible();
    });

    test("shows Uptime Kuma link", async ({ page }) => {
        await expect(
            page.getByRole("link", { name: "Uptime Kuma" })
        ).toBeVisible();
    });
});

test.describe("Add Monitor Page (/add)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/add", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("shows socket connection error", async ({ page }) => {
        await expect(
            page.getByText("Cannot connect to the socket server")
        ).toBeVisible();
    });

    test("URL is /add", async ({ page }) => {
        await expect(page).toHaveURL("/add");
    });
});

test.describe("Manage Status Pages (/manage-status-page)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/manage-status-page", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("shows socket connection error", async ({ page }) => {
        await expect(
            page.getByText("Cannot connect to the socket server")
        ).toBeVisible();
    });

    test("URL stays at /manage-status-page", async ({ page }) => {
        await expect(page).toHaveURL("/manage-status-page");
    });
});

test.describe("Add Status Page (/add-status-page)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/add-status-page", { waitUntil: "networkidle" });
    });

    test("has correct page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Uptime Kuma/);
    });

    test("shows socket connection error", async ({ page }) => {
        await expect(
            page.getByText("Cannot connect to the socket server")
        ).toBeVisible();
    });
});

test.describe("Maintenance Pages", () => {
    test("manage maintenance page shows socket error", async ({ page }) => {
        await page.goto("/maintenance", { waitUntil: "networkidle" });
        await expect(page).toHaveTitle(/Uptime Kuma/);
        await expect(
            page.getByText("Cannot connect to the socket server")
        ).toBeVisible();
    });

    test("add maintenance page shows socket error", async ({ page }) => {
        await page.goto("/add-maintenance", { waitUntil: "networkidle" });
        await expect(page).toHaveTitle(/Uptime Kuma/);
        await expect(
            page.getByText("Cannot connect to the socket server")
        ).toBeVisible();
    });
});
