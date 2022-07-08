import {Page} from "@playwright/test";

const getOptions = async (page: Page, selector: string) => {
    return await page.$$eval(`${selector} > option`, (opts) => {
        return opts.map(option => option.textContent).filter(option => option !== '[Please Select]')
    })
}

const getRandomOption = async (page: Page, selector: string) => {
    const options = await getOptions(page, selector)
    return options[Math.floor(Math.random() * options.length)];
}

export const selectRandomOption = async (page: Page, selector: string) => {
    await page.selectOption(selector, { label: await getRandomOption(page, selector) })
}