import { expect, type Page } from '@playwright/test'
import { Person } from '../delius/utils/person'

export const searchForPerson = async (page: Page, crn: string, person: Person) => {
    await page.locator('#searchTerm').fill(crn)
    await page.getByRole('button', { name: /Apply filters/ }).click()
    const fullName = person.firstName + ' ' + person.lastName
    await page.getByRole('link', { name: fullName }).click()
    await expect(page.locator('//dt[text()="CRN"]/../dd[1]')).toContainText(crn)
    await expect(page.locator('h1.govuk-heading-l')).toContainText(fullName)
}
