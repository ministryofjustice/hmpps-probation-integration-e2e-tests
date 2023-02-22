import { expect, type Page } from '@playwright/test'

export const completeDisabilitiesAndMentalHealthSection = async (page: Page) => {
    await page.locator('#additional_disabilities').click()
    await page.locator('#additional_disabilities_details').fill('Entering Text related to sexual offending')
    await page.locator('#disabilities').click()
    await page.locator('#disabilities_details').fill('Entering Text related to sexual offending')
    await page
        .getByRole('group', { name: 'Mark disabilities and mental health section as complete?' })
        .getByLabel('Yes')
        .check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
