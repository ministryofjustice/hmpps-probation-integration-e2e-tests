import { type Page, expect } from '@playwright/test'
import { splitDate } from '../../common/common'
import { DateTime } from 'luxon'

const futureDate = DateTime.now().plus({ months: 5 })
export const [futureDay, futureMonth, futureYear] = splitDate(futureDate)

export const selectReleaseDateKnownStatus = async (page: Page) => {
    await page.getByLabel('Yes').check()
    await page.fill('#releaseDate-day', futureDay)
    await page.fill('#releaseDate-month', futureMonth)
    await page.fill('#releaseDate-year', futureYear)
    await page.locator('.govuk-button', { hasText: 'Save and continue' }).click()
    await expect(page.locator('#main-content h1')).toContainText(/the date you want the placement to start?/)
}
