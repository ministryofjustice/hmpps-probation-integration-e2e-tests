import { type Page, expect } from '@playwright/test'
import { refreshUntil } from '../../delius/utils/refresh'

export const clickCMSRecord = async (page: Page) => {
    await refreshUntil(page, () => expect(page.locator("[headers='CMS_EVENT_NUMBER_R8794830689804117']")).toBeVisible())
    await page.click('[headers="CMS_EVENT_NUMBER_R8794830689804117"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('Delius Offender Details')
}
