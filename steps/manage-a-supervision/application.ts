import { expect, Page } from '@playwright/test'
import { doUntil } from '../delius/utils/refresh'

export async function searchPersonInMPoP(page: Page, crn: string, heading?: ReturnType<Page['locator']>) {
    await page.getByRole('link', { name: 'Search' }).click()
    await page.pause()
    await page.getByLabel('Find a person on probation').fill(crn)
    await doUntil(
        () => page.getByRole('button', { name: 'Search' }).click(),
        () => expect(page.locator('#search-results-container')).toContainText(crn)
    )

    // Leaving this commented out as it's not confirmed whether the Search button will be removed
    // await expect(page.locator('#search-results-container')).toContainText(crn)

    await page.locator(`[href$="${crn}"]`).first().click()

    if (heading) {
        await expect(heading).toContainText(/Overview/i)
    }
}
