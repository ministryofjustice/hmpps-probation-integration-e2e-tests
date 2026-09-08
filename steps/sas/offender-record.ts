import { type Page } from '@playwright/test'

export const searchForPerson = async (page: Page, crn: string) => {
    await page.locator('#searchTerm').fill(crn)
    await page.getByRole('button', { name: /Apply filters/ }).click()
    await page.getByRole('link', { name: 'Unknown' }).click()
}
