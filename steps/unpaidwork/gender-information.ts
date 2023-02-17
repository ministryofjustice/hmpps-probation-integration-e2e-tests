import { expect, type Page } from '@playwright/test'

export const completeGenderInformationSection = async (page: Page) => {
    await page.locator('#gender_identity').check()
    await page.getByLabel('Female').check()
    await page
        .getByRole('group', {
            name: 'Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to?',
        })
        .getByLabel('Yes')
        .check()
    await page
        .getByLabel(
            'Give details and discuss placement options with the individual, based on their gender identity. Record their preference and the details of the conversation.'
        )
        .fill('Entering Text related to sex change')
    await page
        .getByRole('group', {
            name: 'Is the individual intersex or do they have a Difference in Sexual Development (DSD)?',
        })
        .getByLabel('Yes')
        .check()
    await page
        .getByRole('group', { name: 'Do they consider themselves to be transgender or have a transgender history?' })
        .getByLabel('Yes')
        .check()
    await page.getByRole('group', { name: 'Mark gender information section as complete?' }).getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
