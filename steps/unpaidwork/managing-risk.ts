import { expect, type Page } from '@playwright/test'

export const completeManagingRiskSection = async (page: Page) => {
    await page.locator('#location_exclusion_criteria').click()
    await page
        .locator('#location_exclusion_criteria_details')
        .fill('Entering Text related to victim exclusion criteria ')
    await page.locator('#restricted_placement').click()
    await page.locator('#restricted_placement_details').fill('Entering Text related to restricted placement')
    await page.locator('#no_female_supervisor').click()
    await page.locator('#no_female_supervisor_details').fill('Entering Text related to female supervisor')
    await page.locator('#no_male_supervisor-2').click()
    await page.locator('#restrictive_orders').click()
    await page.locator('#restrictive_orders_details').fill('Entering Text related to Restrictive orders')
    await page.locator('#risk_management_issues_individual').click()
    await page
        .locator('#risk_management_issues_individual_details')
        .fill('Entering Text related to individual placement')
    await page.locator('#risk_management_issues_supervised_group').click()
    await page
        .locator('#risk_management_issues_supervised_group_details')
        .fill('Entering Text related to supervised group')
    await page.locator('#alcohol_drug_issues').click()
    await page.locator('#alcohol_drug_issues_details').fill('Entering Text related to alcohol & drug issues')
    await page.locator('#managing_risk_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Managing risk")').first()).toContainText('Completed')
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
}
