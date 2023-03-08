import { expect, type Page } from '@playwright/test'

export const completeAvailabilitySection = async (page: Page) => {
    await page.getByLabel('Available for work Monday morning').check()
    await page.getByLabel('Available for work Tuesday afternoon').check()
    await page.getByLabel('Available for work Wednesday afternoon').check()
    await page.getByLabel('Available for work Thursday morning').check()
    await page.getByLabel('Available for work Friday morning').check()
    await page.getByLabel('Available for work Saturday afternoon').check()
    await page.getByLabel('Available for work Sunday morning').check()
    await page
        .getByRole('group', { name: 'Mark availability for community payback work section as complete?' })
        .getByLabel('Yes')
        .check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
