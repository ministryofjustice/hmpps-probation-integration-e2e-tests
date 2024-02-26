import { type Page, expect } from '@playwright/test'
import { doUntil } from '../delius/utils/refresh'

export const offenderSearchWithCRN = async (page: Page, crn: string) => {
    await page.getByLabel('Delius Case Reference Number').fill(crn)
    await page.locator('#B6587749879592406', { hasText: 'Search' }).click()
    await page.getByLabel('Search Delius?').selectOption('Yes')
    await page.locator('#B6587749879592406', { hasText: 'Search' }).click()
    await doUntil(
        () => page.click('[headers="C011_R8087527433342967"]'),
        () => expect(page.locator('#contextleft > h3')).toHaveText('Delius Offender Details')
    )
}
