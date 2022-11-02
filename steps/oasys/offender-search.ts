import { type Page, expect } from '@playwright/test'

export const offenderSearchWithCRN = async (page: Page, crn: string) => {
    await page.fill('#P900_CMS_PROB_NUMBER', crn)
    await page.click('#B6587749879592406')
    await page.locator('#P900_SEARCH_CMS').selectOption({ label: 'Yes' })
    await page.click('#B6587749879592406')
    await page.click('[headers="C011_R8087527433342967"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('CMS Offender Details')
}
