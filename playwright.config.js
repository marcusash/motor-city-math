// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/playwright',
    timeout: 60000,
    retries: 1,
    use: {
        baseURL: 'https://marcusash.github.io/motor-city-math/',
        headless: true,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
