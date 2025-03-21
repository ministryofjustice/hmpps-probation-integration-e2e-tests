import { expect, type Page } from '@playwright/test'

export const completeDisabilitiesAndMentalHealthSection = async (page: Page) => {
    await page.locator('#additional_disabilities').click()
    await page.locator('#additional_disabilities_details').fill('Entering Text related to sexual offending')
    await page.locator('#disabilities').click()
    await page.locator('#disabilities_details').fill('Entering Text related to sexual offending')
    await page.locator('#disabilities_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Disabilities and mental health")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
