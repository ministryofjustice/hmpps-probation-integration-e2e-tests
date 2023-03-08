import { expect, type Page } from '@playwright/test'

export const completeTravelInformationSection = async (page: Page) => {
    await page.locator('#travel_information').click()
    await page.locator('#travel_information_details').fill('Entering Text related to Allergies')
    await page.locator('#driving_licence').click()
    await page.locator('#vehicle').click()
    await page.locator('#public_transport').click()
    await page.locator('#travel_information_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Travel")').first()).toContainText(('COMPLETED').toLowerCase())
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
