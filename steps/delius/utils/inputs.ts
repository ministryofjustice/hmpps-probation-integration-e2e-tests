import {Page} from "@playwright/test";
import {DeliusDateFormatter} from "./date-time";

const getOptions = async (page: Page, selector: string) => {
    return await page.$$eval(`${selector} > option`, (opts) => {
        return opts.map(option => option.textContent).filter(option => option !== "[Please Select]")
    })
}

const getRandomOption = async (page: Page, selector: string, timeout: number = 2) => {
    const waitUntil = new Date().getSeconds() + timeout
    let options = []
    while (options.length == 0 && new Date().getSeconds() <= waitUntil) {
        options = await getOptions(page, selector)
    }
    return options[Math.floor(Math.random() * options.length)];
}

const selectRandomOption = async (page: Page, selector: string) => {
    await page.selectOption(selector, {label: await getRandomOption(page, selector)})
}

export const selectOption = async (page: Page, selector: string, option: string = "") => {
    if (option) {
        await page.selectOption(selector, {label: option})
    } else {
        await selectRandomOption(page, selector)
    }
}

export const fillDate = async (page: Page, selector: string, date: Date) => {
    await page.fill(selector, DeliusDateFormatter(date))
}