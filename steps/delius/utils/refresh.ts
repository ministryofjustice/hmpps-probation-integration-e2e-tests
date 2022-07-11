import {Locator, Page} from "@playwright/test";

export const refreshUntil = async (page: Page, locator: Locator, timeout: number = 20) => {
    const waitUntil = new Date().getSeconds() + timeout
    while (!await locator.isVisible() && new Date().getSeconds() <= waitUntil) {
        await page.reload({waitUntil: "domcontentloaded"})
    }
}