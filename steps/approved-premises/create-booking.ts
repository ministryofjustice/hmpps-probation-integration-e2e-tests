import {type Page, expect} from '@playwright/test'

export const createBooking = async (page: Page) => {
    await page.fill('#arrivalDate-day', '10')
    await page.fill('#arrivalDate-month', '12')
    await page.fill('#arrivalDate-year', '2022')
    await page.fill('#departureDate-day', '10')
    await page.fill('#departureDate-month', '12')
    await page.fill('#departureDate-year', '2023')
    await page.locator('button', {hasText: 'Submit'}).click()
    await expect(page.locator('#main-content h1')).toHaveText('Placement confirmed')
}
