import {expect, type Page} from '@playwright/test'

export const completeTrainingEmplOpportunitiesSection = async (page: Page) => {
    await page.getByRole('group', {name: 'Does the individual have an education, training or employment-related need?'}).first().getByLabel('Yes').first().check()
    await page.getByRole('group', {name: 'Does the individual have an education, training or employment-related need?'}).first().getByLabel('Give details').first().fill('Entering Text related to education, training or employment-related need')
    await page.getByRole('group', {name: 'Does the individual agree to use the maximum entitlement of their hours on this activity?'}).getByLabel('Yes').check()
    await page.getByRole('group', {name: 'Mark training and employment section as complete?'}).getByLabel('Yes').check()
    await page.getByRole('button', {name: 'Save'}).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
