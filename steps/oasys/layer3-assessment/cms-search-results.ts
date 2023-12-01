import { type Page, expect } from '@playwright/test'

export const clickCMSRecord = async (page: Page, timeout: number) => {
    await page.click('[headers="CMS_EVENT_NUMBER_R8794830689804117"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('CMS Offender Details', {timeout: timeout})
}
