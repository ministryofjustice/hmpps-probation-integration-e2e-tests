import { Page } from '@playwright/test'
import { DeliusDateFormatter, DeliusTimeFormatter } from './date-time'

const getOptions = async (page: Page, selector: string) => {
    return await page.$$eval(`${selector} > option`, opts => {
        return opts.map(option => option.textContent).filter(option => option !== '[Please Select]')
    })
}

const getRandomOption = async (page: Page, selector: string, timeout = 2) => {
    const waitUntil = new Date().getSeconds() + timeout
    let options = []
    while (options.length == 0 && new Date().getSeconds() <= waitUntil) {
        options = await getOptions(page, selector)
    }
    return options[Math.floor(Math.random() * options.length)]
}

export const selectOption = async (page: Page, selector: string, option: string = null): Promise<string> => {
    if (option == null) {
        option = await getRandomOption(page, selector)
    }
    await page.selectOption(selector, { label: option })
    return option
}

export const fillDate = async (page: Page, selector: string, date: Date) => {
    await page.fill(selector, DeliusDateFormatter(date))
}

export const fillTime = async (page: Page, selector: string, time: Date) => {
    await page.fill(selector, DeliusTimeFormatter(time))
}
