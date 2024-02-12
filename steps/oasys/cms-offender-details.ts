import { type Page, expect } from '@playwright/test'
import { refreshUntil } from '../delius/utils/refresh'

export const clickCreateOffenderButton = async (page: Page) => {
    await page.click('#B8409510857074181')
    await refreshUntil(page, () => expect(page.locator('#contextleft > h3')).toHaveText('Offender Details'))
}
