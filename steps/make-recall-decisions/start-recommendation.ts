import { expect, type Page } from '@playwright/test'

export const startRecommendation = async (page: Page, crn: string, name: string) => {
    await page.getByRole('button', { name: 'Start now' }).click()
    await searchForPerson(page, crn, name)
    await page.getByRole('link', { name: 'Make a recommendation' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
}

async function searchForPerson(page: Page, crn: string, name: string) {
    await expect(page.locator('h1')).toHaveText('Search for a person on probation')
    await page.fill('#crn', crn)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.locator(`a`, { hasText: name }).click()
}
