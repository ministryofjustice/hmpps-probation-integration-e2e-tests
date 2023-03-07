import {expect, type Page} from '@playwright/test'

export const completeIntensiveWorkingSection = async (page: Page) => {
    await page.getByRole('group', {name: 'Is the individual eligible for intensive working?'}).getByLabel('Yes').first().check()
    await page.getByRole('group', {name: 'Is the individual eligible for intensive working?'}).getByLabel('Recommended hours per week in addition to statutory minimum, at the start of the order').fill('7')
    await page.getByRole('group', {name: 'Is the individual eligible for intensive working?'}).getByLabel('Recommended hours per week in addition to statutory minimum, at the midpoint of the order').fill('21')
    await page.getByRole('group', {name: 'Is the individual eligible for intensive working?'}).getByLabel('At what point should the individual be expected to reach a 28-hour working week?').fill('Entering Text related to 28-hour working week')
    await page.getByRole('group', {name: 'Mark intensive working section as complete?'}).getByLabel('Yes').check()
    await page.getByRole('button', {name: 'Save'}).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
