import { type Page } from '@playwright/test'
import { DeliusDateFormatter, DeliusTimeFormatter, OasysDateFormatter } from './date-time'
import { waitForAjax } from './refresh'

const getOptions = async (page: Page, selector: string, filter: (s: string) => boolean = null) => {
    return (await page.$$eval(`${selector} > option`, opts => opts.map(option => option.textContent)))
        .filter(option => option !== '[Please Select]')
        .filter(filter ? filter : () => true)
}

const getRandomOption = async (page: Page, selector: string, timeout = 2, filter: (s: string) => boolean = null) => {
    const waitUntil = new Date().getSeconds() + timeout
    let options = []
    while (options.length == 0 && new Date().getSeconds() <= waitUntil) {
        options = await getOptions(page, selector, filter)
    }
    return options[Math.floor(Math.random() * options.length)]
}

export const selectOption = async (
    page: Page,
    selector: string,
    option: string = null,
    filter: (s: string) => boolean = null,
    attempts = 3
): Promise<string> => {
    // Delius has lots of dynamic drop-down fields that are populated based on previous actions, so wait for any
    // asynchronous requests to complete before attempting to select an option.
    await waitForAjax(page)
    const optionToSelect = option != null ? option : await getRandomOption(page, selector, 2, filter)
    try {
        await page.selectOption(selector, { label: optionToSelect }, { timeout: 5000 })
        return optionToSelect
    } catch (e) {
        if (option == null && attempts > 0) {
            // Sometimes the options change even after we've waited for asynchronous requests to complete, so retry with
            // a new random option after 5 seconds
            return await selectOption(page, selector, option, filter, attempts - 1)
        } else throw e
    }
}

export const fillDate = async (page: Page, selector: string, date: Date) => {
    await page.fill(selector, DeliusDateFormatter(date))
}
export const fillDateOasys = async (page: Page, selector: string, date: Date) => {
    await page.fill(selector, OasysDateFormatter(date))
}

export const fillTime = async (page: Page, selector: string, time: Date) => {
    await page.fill(selector, DeliusTimeFormatter(time))
}
