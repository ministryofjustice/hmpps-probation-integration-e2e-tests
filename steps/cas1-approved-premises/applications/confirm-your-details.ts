import { expect, type Page } from '@playwright/test'

export const confirmYourDetails = async (page: Page) => {
    await page.locator('[value="phoneNumber"]').check()
    await page.locator('#phoneNumber').fill('07777777777777')
    await page.getByRole('group', { name: 'Do you have case management responsibility?' }).getByLabel('Yes').check()
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText(/do they have a transgender history?/)
}
