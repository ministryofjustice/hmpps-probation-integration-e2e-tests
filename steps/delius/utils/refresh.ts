import {Page} from "@playwright/test";

export const refreshUntil = async (
    page: Page,
    predicate: () => Promise<boolean>,
    timeout: number = 60,
    delay: number = 100,
) => {
    await doUntil(page, async () => {
        await page.reload({waitUntil: "domcontentloaded"})
    }, predicate, timeout, delay)
}

export const doUntil = async (
    page: Page,
    action: () => Promise<void>,
    predicate: () => Promise<boolean>,
    timeout: number = 60,
    delay: number = 100,
) => {
    const waitUntil = new Date().getSeconds() + timeout
    while (!await predicate() && new Date().getSeconds() <= waitUntil) {
        await action()
        await delayFor(delay)
    }
}

const delayFor = async (time: number) => new Promise(f => setTimeout(f, time));