import { type Page } from '@playwright/test'
import { Person } from '../delius/utils/person'

export const searchTierByCRN = async (page: Page, crn: string, person: Person) => {
    await page.getByRole('button', { name: 'Start now' }).click()
    await page.getByLabel('Find a person on probation').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('link', { name: `${person.lastName}, ${person.firstName}` }).click()
}
