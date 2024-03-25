import { expect, type Page } from '@playwright/test'

export const verifyRsrScore = async (page: Page, score: string) => {
    await page.click('#navigation-include\\:linkNavigation2EventList')
    await page.click("a[title='View event']")
    await page.click('#navigation-include\\:linkNavigation3CaseAllocation')
    await expect(page.locator('#RSRScore\\:outputText')).toHaveText(`${parseFloat(score)}`)
}
