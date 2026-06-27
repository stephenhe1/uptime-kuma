import { test, expect } from "@playwright/test";

/**
 * Tests for overall app layout, theming, and global components.
 */

test.describe("App Theming", () => {
    test("body has 'light' theme class by default", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        const bodyClass = await page.locator("body").getAttribute("class");
        expect(bodyClass).toContain("light");
    });

    test("app renders in a div#app element", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        await expect(page.locator("#app")).toBeAttached();
    });
});

test.describe("Layout Header", () => {
    test("header renders with Uptime Kuma title on dashboard", async ({
        page,
    }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        const header = page.locator("header").first();
        await expect(header).toBeVisible();
        await expect(header.getByText("Uptime Kuma")).toBeVisible();
    });

    test("Uptime Kuma title is a link in the header", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        const link = page.getByRole("link", { name: "Uptime Kuma" });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", "/dashboard");
    });

    test("header contains nav element", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        await expect(page.locator("header ul.nav")).toBeAttached();
    });
});

test.describe("Socket Connection Error Banner", () => {
    const pagesWithLayout = [
        "/dashboard",
        "/list",
        "/add",
        "/maintenance",
        "/manage-status-page",
        "/add-maintenance",
        "/add-status-page",
        "/settings/general",
    ];

    for (const route of pagesWithLayout) {
        test(`'${route}' shows lost-connection banner`, async ({ page }) => {
            await page.goto(route, { waitUntil: "networkidle" });
            const banner = page.locator(".lost-connection");
            await expect(banner).toBeVisible();
        });
    }

    test("error banner contains socket error message", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        const banner = page.locator(".lost-connection");
        const text = await banner.innerText();
        expect(text).toContain("Cannot connect to the socket server");
    });

    test("error banner contains reverse proxy hint", async ({ page }) => {
        await page.goto("/dashboard", { waitUntil: "networkidle" });
        const banner = page.locator(".lost-connection");
        await expect(
            banner.getByRole("link", { name: /WebSocket/i })
        ).toBeVisible();
    });
});

test.describe("Pages Without Layout (no socket error)", () => {
    const pagesWithoutLayout = [
        "/setup",
        "/setup-database",
        "/status",
        "/status-page",
    ];

    for (const route of pagesWithoutLayout) {
        test(`'${route}' does NOT show lost-connection banner`, async ({
            page,
        }) => {
            await page.goto(route, { waitUntil: "networkidle" });
            const banner = page.locator(".lost-connection");
            await expect(banner).not.toBeVisible();
        });
    }
});

test.describe("404 Not Found Page Layout", () => {
    test("404 page has header with Uptime Kuma link", async ({ page }) => {
        await page.goto("/totally-unknown-page-123", {
            waitUntil: "networkidle",
        });
        const header = page.locator("header").first();
        await expect(header).toBeVisible();
        await expect(header.getByText("Uptime Kuma")).toBeVisible();
    });

    test("404 page does NOT show socket error banner", async ({ page }) => {
        await page.goto("/totally-unknown-page-123", {
            waitUntil: "networkidle",
        });
        await expect(page.locator(".lost-connection")).not.toBeVisible();
    });

    test("404 page shows navigation links at bottom", async ({ page }) => {
        await page.goto("/totally-unknown-page-123", {
            waitUntil: "networkidle",
        });
        await expect(
            page.getByRole("link", { name: /home page/i })
        ).toBeVisible();
        await expect(
            page.getByRole("link", { name: /previous page/i })
        ).toBeVisible();
    });
});

test.describe("noscript Fallback", () => {
    test("noscript message is in page source", async ({ page }) => {
        await page.goto("/dashboard");
        const content = await page.content();
        expect(content).toContain("JavaScript");
    });
});
