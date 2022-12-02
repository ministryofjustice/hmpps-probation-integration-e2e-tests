import { type Page, expect } from '@playwright/test'
import { splitDate } from '../common/common.js'
import {LastMonth, NextYear} from "../delius/utils/date-time.js";

const [pastDay, pastMonth, pastYear] = splitDate(LastMonth)
const [futureDay, futureMonth, futureYear] = splitDate(NextYear)

export const createBooking = async (page: Page) => {
    await page.fill('#arrivalDate-day', pastDay)
    await page.fill('#arrivalDate-month', pastMonth)
    await page.fill('#arrivalDate-year', pastYear)
    await page.fill('#departureDate-day', futureDay)
    await page.fill('#departureDate-month', futureMonth)
    await page.fill('#departureDate-year', futureYear)
    await page.locator('button', { hasText: 'Submit' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Placement confirmed')
}
