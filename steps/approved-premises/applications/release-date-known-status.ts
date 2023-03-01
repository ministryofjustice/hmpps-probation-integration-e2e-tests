import { type Page, expect } from '@playwright/test'
import { splitDate } from '../../common/common.js'
import { AfterFiveMonths } from '../../delius/utils/date-time.js'

export const [futureDay, futureMonth, futureYear] = splitDate(AfterFiveMonths)

export const selectReleaseDateKnownStatus = async (page: Page) => {
    await page.getByLabel('Yes').check()
    await page.fill('#releaseDate-day', futureDay)
    await page.fill('#releaseDate-month', futureMonth)
    await page.fill('#releaseDate-year', futureYear)
    // await page.locator('button', { hasText: 'Submit' }).click()
    // await page.locator('button', { hasText: 'Save and continue' }).click()
    await page.locator('.govuk-button').click();
    await expect(page.locator('#main-content h1')).toContainText(/the date you want the placement to start?/)
}
