import { expect, type Page } from '@playwright/test'
import { splitDate } from '../common/common.js'
import { NextMonth, Tomorrow } from '../delius/utils/date-time.js'

const [arrivalDay, arrivalMonth, arrivalYear] = splitDate(Tomorrow)
const [departureDay, departureMonth, departureYear] = splitDate(NextMonth)

export const createBooking = async (page: Page) => {
    await page.fill('#arrivalDate-day', arrivalDay)
    await page.fill('#arrivalDate-month', arrivalMonth)
    await page.fill('#arrivalDate-year', arrivalYear)
    await page.fill('#departureDate-day', departureDay)
    await page.fill('#departureDate-month', departureMonth)
    await page.fill('#departureDate-year', departureYear)
    await page.locator('button', { hasText: 'Submit' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Placement confirmed')
}
