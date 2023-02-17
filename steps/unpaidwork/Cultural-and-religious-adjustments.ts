import { expect, type Page } from '@playwright/test'

export const completeCulturalReligiousAdjustmentsSection = async (page: Page) => {
    await page.locator('#cultural_religious_adjustment').click()
    await page
        .locator('#cultural_religious_adjustment_details')
        .fill('Entering Text related to Cultural and religious adjustments')
    await page
        .getByRole('group', { name: 'Mark cultural or religious adjustments section as complete?' })
        .getByLabel('Yes')
        .check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
