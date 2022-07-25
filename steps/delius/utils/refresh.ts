import {Page} from "@playwright/test";

export const refreshUntil = async (page: Page, predicate: () => Promise<boolean>, timeout: number = 20) => {
    await doUntil(page, predicate, async () => {
        await page.reload({waitUntil: "domcontentloaded"})
    }, timeout)
}

export const doUntil = async (page: Page, predicate: () => Promise<boolean>, action: () => Promise<void>, timeout: number = 20) => {
    const waitUntil = new Date().getSeconds() + timeout
    while (!await predicate() && new Date().getSeconds() <= waitUntil) {
        await action()
    }
}