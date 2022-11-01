import { Page, expect } from '@playwright/test'

export const clickCreateOffenderButton = async (page: Page) => {
    await page.click('#B8409510857074181')
    await expect(page.locator('#contextleft > h3')).toHaveText('Offender Details')
}
