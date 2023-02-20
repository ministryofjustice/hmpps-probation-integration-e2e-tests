import { expect, type Page } from '@playwright/test'

export const completeRiskHarmCommunitySection = async (page: Page) => {
    await page.locator('#history_sexual_offending').click()
    await page.locator('#history_sexual_offending_details').fill('Entering Text related to sexual offending')
    await page.locator('#poses_risk_to_children').click()
    await page.locator('#poses_risk_to_children_details').fill('Entering Text related to sexual offending')
    await page.locator('#poses_risk_to_children').click()
    await page.locator('#poses_risk_to_children_details').fill('Entering Text related to risk to children ')
    await page.locator('#violent_offences').click()
    await page.locator('#violent_offences_details').fill('Entering Text related to Violent offences')
    await page.locator('#acquisitive_offending').click()
    await page.locator('#acquisitive_offending_details').fill('Entering Text related to acquisitive offending')
    await page.locator('#sgo_identifier').click()
    await page.locator('#sgo_identifier_details').fill('Entering Text related to serious group offending')
    await page.locator('#control_issues').click()
    await page.locator('#control_issues_details').fill('Entering Text related to disruptive behaviour')
    await page.locator('#high_profile_person').click()
    await page.locator('#high_profile_person_details').fill('Entering Text related to hate-based attitudes')
    await page.locator('#history_of_hate_based_behaviour').click()
    await page.locator('#history_of_hate_based_behaviour_details').fill('Entering Text related to hate-based attitudes')
    await page.locator('#high_profile_person').click()
    await page.locator('#high_profile_person_details').fill(' Entering Text related to high-profile person')
    await page.locator('#additional_rosh_info').click()
    await page.locator('#additional_rosh_info_details').fill('Entering Text related to Additional information ')
    await page
        .getByRole('group', { name: 'Mark risk of harm in the community section as complete?' })
        .getByLabel('Yes')
        .check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
