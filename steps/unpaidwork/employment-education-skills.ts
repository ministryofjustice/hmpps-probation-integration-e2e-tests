import { expect, type Page } from '@playwright/test'

export const completeEmplEducationSkillsSection = async (page: Page) => {
    await page.getByRole('group', { name: 'Is the individual in employment or education?' }).getByLabel('Full-time education or employment').check()
    await page.getByLabel('Employment or education details (working days, hours etc)').first().fill('Entering Text related to Full-time education')
    await page.getByRole('group', { name: 'Does the individual have any difficulties with reading, writing or numbers?' }).getByLabel('Yes').check()
    await page.getByRole('group', { name: 'Does the individual have any difficulties with reading, writing or numbers?' }).getByLabel('Give details').fill('Entering Text related to writing difficulties')
    await page.getByRole('group', { name: 'Does the individual have any work skills or experience that could be used while carrying out Community Payback?' }).getByLabel('Yes').check()
    await page.getByRole('group', { name: 'Does the individual have any work skills or experience that could be used while carrying out Community Payback?' }).getByLabel('Give details').fill('Entering Text related to work skills')
    await page.getByRole('group', { name: 'Does the individual have future work plans that could be supported through a Community Payback placement?' }).getByLabel('Yes').check()
    await page.getByRole('group', { name: 'Does the individual have future work plans that could be supported through a Community Payback placement?' }).getByLabel('Give details').fill('Entering Text related to future work plans')
    await page.getByRole('group', { name: 'Mark employment, education and skills section as complete?' }).getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText('Most of the questions in this assessment must be answered, but some are optional and are marked as such.')
}
