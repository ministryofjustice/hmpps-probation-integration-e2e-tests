import {Page} from "@playwright/test";

export const refreshUntil = async (page: Page, predicate: Promise<Boolean>, timeout: number = 20) => {
    const waitUntil = new Date().getSeconds() + timeout
    while (!await predicate && new Date().getSeconds() <= waitUntil) {
        await page.reload({waitUntil: 'networkidle'})
    }
}