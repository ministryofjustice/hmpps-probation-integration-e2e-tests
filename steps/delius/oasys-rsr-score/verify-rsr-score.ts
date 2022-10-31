import {expect, Page} from '@playwright/test'

export const verifyRsrScore = async (page: Page, score: string) => {
    await page.click('#linkNavigation2EventList')
    await page.click('a[title=\'View event\']')
    await page.click('#linkNavigation3CaseAllocation')
    await expect(page.locator('#interAreaForm:RSRScore')).toHaveText(score)
}
