import {type Page, expect} from '@playwright/test'
import {format, addMonths, subDays} from "date-fns";

const splitDate = (s) => {
    const dateElements = s.split(' ')
    return dateElements
}

const pastDate = format(subDays(new Date(), 30), 'dd MM yyyy')
const futureDate = format(addMonths(new Date(), 11), 'dd MM yyyy')
const [pastDay, pastMonth, pastYear] = splitDate(pastDate);
const [futureDay, futureMonth, futureYear] = splitDate(futureDate);

export const createBooking = async (page: Page) => {
    await page.fill('#arrivalDate-day', pastDay)
    await page.fill('#arrivalDate-month', pastMonth)
    await page.fill('#arrivalDate-year', pastYear)
    await page.fill('#departureDate-day', futureDay)
    await page.fill('#departureDate-month', futureMonth)
    await page.fill('#departureDate-year', futureYear)
    await page.locator('button', {hasText: 'Submit'}).click()
    await expect(page.locator('#main-content h1')).toHaveText('Placement confirmed')
}
