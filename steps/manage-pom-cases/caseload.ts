import { type Page } from '@playwright/test'

export const switchCaseload = async (page: Page, caseload: string) => {
    await page.getByRole('link', { name: 'Change your location' }).click()
    await page.getByRole('link', { name: caseload }).click()
}
