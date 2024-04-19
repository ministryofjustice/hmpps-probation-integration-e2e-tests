import { expect, type Page } from '@playwright/test'

export const refreshUntil = async (page: Page, expectation: () => Promise<void>, options?) => {
    await doUntil(async () => page.reload(), expectation, options)
}

export const doUntil = async <T>(
    action: () => Promise<T>,
    expectation: () => Promise<void>,
    options: { timeout?: number; intervals?: number[] } = { timeout: 60_000, intervals: [250, 500, 1000, 5000] }
) => {
    await expect(async () => {
        await action()
        return await expectation()
    }).toPass(options)
}

export const waitForJS = (page: Page, timeout = 0) => {
    const timeToWait = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))
    return page.evaluate(timeToWait, timeout)
}

export const waitForAjax = async (page: Page): Promise<void> => {
    try {
        await expect(page.locator('.ajax-loading')).toBeAttached({ timeout: 5000 })
    } catch (e) {
        console.warn('Timed out waiting for ajax to start, maybe no ajax request is triggered for this field?', e)
    }
    await expect(page.locator('.ajax-loading')).not.toBeAttached()
}
