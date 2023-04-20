import { type Page, expect } from '@playwright/test'

export const offenderSearchWithCRN = async (page: Page, crn: string) => {
    await page.getByLabel('Probation Case Reference Number').fill(crn)
    await page.locator('#B6587749879592406', { hasText: 'Search' }).click()
    await page.getByLabel('Search CMS?').selectOption('Yes')
    await page.locator('#B6587749879592406', { hasText: 'Search' }).click()
    await page.click('[headers="C011_R8087527433342967"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('CMS Offender Details')
}
