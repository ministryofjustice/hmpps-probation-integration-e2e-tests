import { type Page } from '@playwright/test'
import { Person } from '../delius/utils/person'

export const searchTierByCRN = async (page: Page, crn: string, person: Person) => {
    await page.getByRole('button', { name: 'Start now' }).click()
    await page.getByLabel('Search for a person on probation').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('link', { name: `${person.firstName} ${person.lastName}` }).click()
}
