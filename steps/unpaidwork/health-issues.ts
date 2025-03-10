import { expect, type Page } from '@playwright/test'

export const completeHealthIssuesSection = async (page: Page) => {
    await page.locator('#allergies').click()
    await page.locator('#allergies_details').fill('Entering Text related to Allergies')
    await page.locator('#loss_consciousness').click()
    await page.locator('#loss_consciousness_details').fill('Entering Text related to Sudden loss of consciousness')
    await page.locator('#epilepsy').click()
    await page.locator('#epilepsy_details').fill('Entering Text related to Epilepsy')
    await page.locator('#pregnancy').click()
    await page.locator('#pregnancy_pregnant_details').fill('Entering Text related to Pregnancy')
    await page.locator('#other_health_issues').click()
    await page.locator('#other_health_issues_details').fill('Entering Text related to Other Health issues')
    await page.locator('#health_issues_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Health issues")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
