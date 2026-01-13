import { expect, Page } from '@playwright/test'
import { doUntil } from '../delius/utils/refresh'

export async function searchPersonInMPoP(page: Page, crn: string, heading?: ReturnType<Page['locator']>) {
    await page.getByRole('link', { name: 'Search' }).click()
    await page.getByLabel('Find a person on probation').fill(crn)

    await doUntil(
        () => page.getByRole('button', { name: 'Search' }).click(),
        () => expect(page.locator('#search-results-container')).toContainText(crn)
    )

    await page.locator(`[href$="${crn}"]`).first().click()

    if (heading) {
        await expect(heading).toContainText(/Overview/i)
    }
}

export const qa = (id: string) => `[data-qa="${id}"]`
