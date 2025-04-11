import { expect, type Page } from '@playwright/test'

export const completeTrainingEmplOpportunitiesSection = async (page: Page) => {
    await page.locator('#education_training_need').click()
    await page
        .locator('#education_training_need_details')
        .fill('Entering Text related to education, training or employment-related need')
    await page.locator('#individual_commitment').click()
    await page.locator('#employment_training_complete').click()
    await page.locator('#training_and_employment_factors_preventing').click()
    await page
        .locator('#training_and_employment_factors_preventing_yes_details')
        .fill(
            'Restrictive conditions including Sexual Harm Prevention Order & Serious Crime Prevention Order that prevents internet access.'
        )
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Training & employment opportunities")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
