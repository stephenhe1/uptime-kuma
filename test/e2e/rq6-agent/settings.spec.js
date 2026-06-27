import { test, expect } from "@playwright/test";

/**
 * Tests for all Settings sub-pages.
 * All settings pages require socket.io + authentication.
 * In the current dev environment the socket cannot connect,
 * so each page shows the connection error banner.
 */

const SETTINGS_ROUTES = [
    "/settings/general",
    "/settings/appearance",
    "/settings/notifications",
    "/settings/reverse-proxy",
    "/settings/tags",
    "/settings/monitor-history",
    "/settings/docker-hosts",
    "/settings/remote-browsers",
    "/settings/security",
    "/settings/api-keys",
    "/settings/proxies",
    "/settings/about",
];

test.describe("Settings Pages - Socket Error State", () => {
    for (const route of SETTINGS_ROUTES) {
        test(`${route} has correct title`, async ({ page }) => {
            await page.goto(route, { waitUntil: "networkidle" });
            await expect(page).toHaveTitle(/Uptime Kuma/);
        });

        test(`${route} shows socket connection error`, async ({ page }) => {
            await page.goto(route, { waitUntil: "networkidle" });
            await expect(
                page.getByText("Cannot connect to the socket server")
            ).toBeVisible();
        });

        test(`${route} URL is correct`, async ({ page }) => {
            await page.goto(route, { waitUntil: "networkidle" });
            await expect(page).toHaveURL(route);
        });
    }
});

test.describe("Settings Navigation", () => {
    test("all settings sub-routes resolve without error pages", async ({
        page,
    }) => {
        // Verify none of the settings routes land on the 404 page
        for (const route of SETTINGS_ROUTES) {
            await page.goto(route, { waitUntil: "networkidle" });
            // 404 page would show "Page Not Found"
            await expect(
                page.getByText("Page Not Found")
            ).not.toBeVisible();
        }
    });
});
