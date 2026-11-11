import { defineConfig, devices } from '@playwright/test';

const PORT = 8080;

/**
 * E2E tests run against the Vite dev server, which Playwright starts automatically.
 * Specs named `*.desktop.spec.ts` / `*.mobile.spec.ts` run only in that project;
 * plain `*.spec.ts` files run in both.
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    retries: 2,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'desktop',
            testIgnore: /\.mobile\.spec\.ts$/,
            use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } },
        },
        {
            name: 'mobile',
            testIgnore: /\.desktop\.spec\.ts$/,
            use: { ...devices['Desktop Chrome'], viewport: { width: 400, height: 800 } },
        },
    ],
    webServer: {
        // VITE_E2E disables React StrictMode (see src/index.tsx).
        command: `VITE_E2E=true yarn vite --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
    },
});
