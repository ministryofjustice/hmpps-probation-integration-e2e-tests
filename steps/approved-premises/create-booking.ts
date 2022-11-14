import { type Page, expect } from '@playwright/test'

export const createBooking = async (page: Page) => {
    await page.fill('#arrivalDate-day', '10')
    await page.fill('#arrivalDate-month', '12')
    await page.fill('#arrivalDate-year', '2022')
    await page.fill('#departureDate-day', '10')
    await page.fill('#departureDate-month', '12')
    await page.fill('#departureDate-year', '2023')

    // await page.getByRole('button', {name: 'Submit'});

    await page.locator('button', { hasText: 'Submit' }).click()

    // await page.locator('text="Submit"').click();

    await expect(page.locator('#main-content h1')).toHaveText('Placement confirmed')
    // await expect(page.locator('.govuk-summary-list')).toHaveText('X371199')

    // await page.locator('link', { hasText: 'Back to dashboard' }).click()


}

export const clickBackToDashboard = async (page: Page) => {
    await page.locator('text=Back to dashboard').click()
    await expect(page.locator('#main-content h1')).toHaveText('Placement confirmed')
}
