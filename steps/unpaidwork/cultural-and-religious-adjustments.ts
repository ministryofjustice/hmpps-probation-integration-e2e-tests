import { expect, type Page } from '@playwright/test'

export const completeCulturalReligiousAdjustmentsSection = async (page: Page) => {
    await page.locator('#cultural_religious_adjustment').click()
    await page
        .locator('#cultural_religious_adjustment_details')
        .fill('Entering Text related to Cultural and religious adjustments')
    await page.locator('#cultural_religious_adjustment_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Cultural and religious adjustments")').first()).toContainText(
        'COMPLETED'.toLowerCase()
    )
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
