import { expect, type Page } from '@playwright/test'

export const refreshUntil = async (page: Page, expectation: () => Promise<void>, options?) => {
    await doUntil(async () => page.reload(), expectation, options)
}

export const doUntil = async <T>(
    action: () => Promise<T>,
    expectation: () => Promise<void>,
    options: { timeout?: number; intervals?: number[] } = { timeout: 60_000, intervals: [100, 250, 500, 1000, 5000] }
) => {
    await expect
        .poll(async () => {
            await action()
            return await toPredicate(expectation())
        }, options)
        .toBeTruthy()
}

export const toPredicate = async (expectation: Promise<void>): Promise<boolean> =>
    expectation.then(() => true).catch(() => false)

export const waitForAjax = async (page: Page) => await page.waitForResponse(page.url())
