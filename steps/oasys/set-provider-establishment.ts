import { type Page, expect } from '@playwright/test'

export const setProviderEstablishment = async (page: Page) => {
    await page.locator('#P10_CT_AREA_EST').selectOption({ label: 'Warwickshire' })
    await page.click('#P10_CONTINUE_BT')
    await expect(page.locator('#searchtop > h2')).toHaveText('Task Manager')
}
