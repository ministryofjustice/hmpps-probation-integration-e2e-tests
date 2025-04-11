import { expect, type Page } from '@playwright/test'

export const completeOtherAdjustmentsSection = async (page: Page) => {
    await page.locator('#diversity_information_trauma').fill('Entering Text related to history of trauma')
    await page
        .locator('#diversity_information_gender')
        .fill('Entering Text related to the preference be placed in a single gender group or individual placement.')
    await page
        .locator('#diversity_information_neurodiversity')
        .fill('Entering Text Neurodivergent condition i.e., Autism Spectrum Disorder')
    await page.locator('#diversity_information_mobility').fill('Entering Text related to access to their own transport')
    await page
        .locator('#diversity_information_maturity_assessment')
        .fill('Entering Text related to Maturity Assessment')
    await page.locator('#diversity_information_maturity').fill('Entering Text related to Maturity')
    await page.locator('#other_adjustments_complete').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Other adjustments")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
