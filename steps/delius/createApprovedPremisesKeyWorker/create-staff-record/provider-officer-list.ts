import { expect, type Page } from '@playwright/test'
import { type Person } from '../../utils/person'

export const ClickAddToAddProviderOfficer = async (page: Page) => {
    await page.locator('input', { hasText: 'Add' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Add Provider Officer')
}

export const searchProviderOfficer = async (page: Page, person: Person) => {
    await page.locator('text="Search For:"').fill(person.lastName)
    await page.locator('input', { hasText: 'Search' }).click()
    await expect(page.locator('#SearchForm\\:staffTable')).toContainText(`${person.lastName}, ${person.firstName}`)
}

export const clickUpdateButton = async (page: Page) => {
    await page.locator('a', { hasText: 'update' }).click()
    await expect(page.locator('#content > h1')).toContainText('Update Provider Officer')
}
