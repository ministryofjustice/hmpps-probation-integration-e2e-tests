import { expect, type Page } from '@playwright/test'

export const completeGenderInformationSection = async (page: Page) => {
    await page.locator('#gender_identity-2').check()
    await page.locator('#sex_change').check()
    await page.locator('#sex_change_details').fill('Entering Text related to sex change')
    await page.locator('#intersex_or_dsd').check()
    await page.locator('#transgender').check()
    await page.locator('#placement_preference_by_gender_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Gender information")').first()).toContainText(('COMPLETED').toLowerCase())
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
