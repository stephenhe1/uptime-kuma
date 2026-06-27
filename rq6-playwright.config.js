import { defineConfig, devices } from "@playwright/test";

const HEADLESS_SHELL =
    "/Users/stephenhe/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell";

export default defineConfig({
    testDir: "./test/e2e/rq6-agent",
    outputDir: "./private/rq6-playwright-test-results",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,

    reporter: [
        [
            "html",
            {
                outputFolder: "./private/rq6-playwright-report",
                open: "never",
            },
        ],
        ["list"],
    ],

    use: {
        baseURL: "http://localhost:3021",
        trace: "on-first-retry",
        launchOptions: {
            executablePath: HEADLESS_SHELL,
        },
    },

    projects: [
        {
            name: "rq6-chrome",
            use: {
                ...devices["Desktop Chrome"],
                launchOptions: {
                    executablePath: HEADLESS_SHELL,
                },
            },
        },
    ],
});
