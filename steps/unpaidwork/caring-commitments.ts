import { expect, type Page } from '@playwright/test'

export const completeCaringCommitmentsSection = async (page: Page) => {
    await page.locator('#active_carer_commitments_details').click()
    await page.locator('#active_carer_commitments_details').fill('Entering Text related to the Caring Commitments')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
