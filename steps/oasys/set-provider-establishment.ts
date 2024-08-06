import { type Page, expect } from '@playwright/test'

export const setProviderEstablishment = async (page: Page) => {
    try {
        // Wait for the option to be visible with a timeout of 5000 milliseconds (5 seconds)
        await page.locator('#P10_CT_AREA_EST').waitFor({ state: 'visible', timeout: 5000 })

        // If the option is visible, select it and continue
        await page.locator('#P10_CT_AREA_EST').selectOption({ label: 'Warwickshire' })
        await page.click('#P10_CONTINUE_BT')
        await expect(page.locator('#searchtop > h2')).toHaveText('Task Manager')
    } catch {
        // If the option is not visible within the timeout, do nothing
        console.error('Option is not visible within the timeout period.')
    }
}
