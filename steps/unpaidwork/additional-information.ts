import { expect, type Page } from '@playwright/test'

export const completeAddtlInformationSection = async (page: Page) => {
    await page
        .locator('#additional_information')
        .fill('Entering text related to the additional information that is relevant for this assessment')
    await page.locator('#additional_information_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Additional information")').first()).toContainText('COMPLETED'.toLowerCase())
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
