import { type Page, expect } from '@playwright/test'
import { splitDate } from '../../common/common'
import { Yesterday } from '../../delius/utils/date-time'
import { faker } from '@faker-js/faker'

const [agreedDay, agreedMonth, agreedYear] = splitDate(Yesterday)

export const addExemptionDetails = async (page: Page) => {
    await page.locator('#agreedCaseWithManager').click()
    await page.getByLabel('Name of senior manager').fill(faker.person.firstName() + ' ' + faker.person.lastName())
    await page.getByLabel('Day').fill(agreedDay)
    await page.getByLabel('Month').fill(agreedMonth)
    await page.getByLabel('Year').fill(agreedYear)
    await page
        .getByLabel('Provide a summary of the reasons why this is an exempt application')
        .fill('Test reason for application exemption')
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText(/do they have a transgender history?/)
}
