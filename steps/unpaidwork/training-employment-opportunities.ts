import { expect, type Page } from '@playwright/test'

export const completeTrainingEmplOpportunitiesSection = async (page: Page) => {
    await page.locator('#education_training_need').click()
    await page
        .locator('#education_training_need_details')
        .fill('Entering Text related to education, training or employment-related need')
    await page.locator('#individual_commitment').click()
    await page.locator('#employment_training_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Training & employment opportunities")').first()).toContainText(
        'COMPLETED'.toLowerCase()
    )
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
