import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../utils/refresh.js'

export const verifyRsrScore = async (page: Page, score: string) => {
    await page.click('#linkNavigation2EventList')
    await page.click("a[title='View event']")
    await page.click('#linkNavigation3CaseAllocation')
    await refreshUntil(page, () => expect(page.locator('#interAreaForm\\:RSRScore')).toHaveText(score))
}
