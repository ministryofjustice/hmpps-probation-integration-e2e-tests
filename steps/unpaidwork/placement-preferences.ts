import { expect, type Page } from '@playwright/test'

export const completePlacementPreferencesSection = async (page: Page) => {
    await page
        .getByRole('group', { name: 'Does the individual have any placement preferences?' })
        .getByLabel('Yes')
        .check()
    await page.locator('#placement_preference').check()
    await page.locator('#placement_preferences').check()
    await page.locator('#placement_preference_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Placement preferences")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
