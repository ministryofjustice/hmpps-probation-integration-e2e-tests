import { expect, type Page } from '@playwright/test'

export const completeIntensiveWorkingSection = async (page: Page) => {
    await page.locator('#eligibility_intensive_working').click()
    await page.locator('#recommended_hours_start_order').fill('7')
    await page.locator('#recommended_hours_midpoint_order').fill('21')
    await page.locator('#twenty_eight_hours_working_week_details').fill('Entering Text related to 28-hour working week')
    await page.locator('#eligibility_intensive_working_complete').click()
    await page.locator('#eligibility_intensive_working_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Intensive working")').first()).toContainText(('COMPLETED').toLowerCase())
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
