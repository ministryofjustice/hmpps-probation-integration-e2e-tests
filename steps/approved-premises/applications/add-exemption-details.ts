import { type Page, expect } from '@playwright/test'
import { splitDate } from '../../common/common.js'
import { Yesterday } from '../../delius/utils/date-time.js'
import { faker } from '@faker-js/faker'

const [agreedDay, agreedMonth, agreedYear] = splitDate(Yesterday)

export const addExemptionDetails = async (page: Page) => {
    await page.locator('#agreedCaseWithManager').click()
    await page.getByLabel('Name of senior manager').fill(faker.name.firstName() + ' ' + faker.name.lastName())
    await page.getByLabel('Day').fill(agreedDay)
    await page.getByLabel('Month').fill(agreedMonth)
    await page.getByLabel('Year').fill(agreedYear)
    await page
        .getByLabel('Provide a summary of the reasons why this is an exempt application')
        .fill('Test reason for application exemption')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toHaveText(
        ' Which of the following best describes the sentence type the person is on?'
    )
}
