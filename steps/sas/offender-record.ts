import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh'

export const searchForPerson = async (page: Page, crn: string, person: { firstName: string; lastName: string }) => {
    await page.locator('#searchTerm').fill(crn)
    await page.getByRole('button', { name: /Apply filters/ }).click()

    const personLink = page.getByRole('link', { name: `${person.lastName}, ${person.firstName}` })
    await refreshUntil(page, () => expect(personLink).toBeVisible())
    await personLink.click()
}
