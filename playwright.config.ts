import { devices, type PlaywrightTestConfig } from '@playwright/test'
import { minutesToMilliseconds } from 'date-fns'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: process.env.TEST_DIR ? process.env.TEST_DIR : './tests',
    /* Maximum time one test can run for. */
    timeout: minutesToMilliseconds(3),
    /* Maximum time test suite can run for. */
    globalTimeout: minutesToMilliseconds(60),
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        timezoneId: 'Europe/London',
        launchOptions: { slowMo: 150 },
        screenshot: 'only-on-failure',
        trace: process.env.CI ? 'off' : 'on',
        ...devices['Desktop Chrome'],
    },

    /* Configure projects */
    projects: [{ name: 'default' }],
}

export default config
