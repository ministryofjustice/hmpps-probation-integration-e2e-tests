import { expect, Page } from '@playwright/test'
import { doUntil } from '../delius/utils/refresh'

export async function searchMPoP(page: Page, term: string) {
    const input = page.getByLabel('Find a person on probation')
    await input.fill(term)
    const searchButton = page.getByRole('button', { name: 'Search', exact: true })
    if (await searchButton.isVisible()) {
        await searchButton.click()
    } else {
        await input.press('Enter')
    }
}

export async function searchPersonInMPoP(page: Page, crn: string, heading?: ReturnType<Page['locator']>) {
    await page.getByRole('link', { name: 'Search' }).click()
    await doUntil(
        () => searchMPoP(page, crn),
        async () => {
            await expect(page.locator(`[href$="${crn}"]`).first()).toBeVisible()
        }
    )
    await page.locator(`[href$="${crn}"]`).first().click()
    if (heading) {
        await expect(heading).toContainText(/Overview/i)
    }
}
