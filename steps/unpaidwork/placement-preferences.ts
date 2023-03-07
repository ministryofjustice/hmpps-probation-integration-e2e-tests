import { expect, type Page } from '@playwright/test'

export const completePlacementPreferencesSection = async (page: Page) => {
    await page
        .getByRole('group', { name: 'Does the individual have any placement preferences?' })
        .getByLabel('Yes')
        .check()
    // await page.getByLabel('Individual').check()
    await page.locator('#placement_preferences').check()
    await page.getByRole('group', { name: 'Mark placement preferences as complete?' }).getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
