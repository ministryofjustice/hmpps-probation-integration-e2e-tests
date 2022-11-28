import {type Page, expect} from '@playwright/test'
import {format, addMonths, subDays} from 'date-fns'
import {splitDate} from '../../common/common.js'

const futureDate = format(addMonths(new Date(), 1), 'dd MM yyyy')
export const [futureDay, futureMonth, futureYear] = splitDate(futureDate)

export const selectReleaseDateKnownStatus = async (page: Page) => {
    await page.getByLabel('Yes').check()
    await page.fill('#releaseDate-day', futureDay)
    await page.fill('#releaseDate-month', futureMonth)
    await page.fill('#releaseDate-year', futureYear)
    await page.locator('button', {hasText: 'Submit'}).click()
    await expect(page.locator('#main-content h1')).toContainText(/the date you want the placement to start?/)
}

