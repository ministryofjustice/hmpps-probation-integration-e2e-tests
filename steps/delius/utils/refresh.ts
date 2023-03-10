import { expect, type Page } from '@playwright/test'

export const refreshUntil = async (page: Page, expectation: () => Promise<void>, options?) => {
    await doUntil(async () => page.reload(), expectation, options)
}

export const doUntil = async <T>(
    action: () => Promise<T>,
    expectation: () => Promise<void>,
    options: { timeout?: number; intervals?: number[] } = { timeout: 60_000, intervals: [100, 250, 500, 1000, 5000] }
) => {
    await expect(async () => {
        await action()
        return await expectation()
    }).toPass(options)
}

export const waitForAjax = async (page: Page) => {
    await page.waitForResponse(page.url())
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 0)));
}
