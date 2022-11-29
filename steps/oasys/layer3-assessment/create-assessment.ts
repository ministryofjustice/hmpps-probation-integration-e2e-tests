import { type Page, expect } from '@playwright/test'

export const createLayer3Assessment = async (page: Page) => {
    await page.locator('#P10_PURPOSE_ASSESSMENT_ELM').selectOption({ label: 'Review' })
    await expect(page.locator('#P10_ASSESSMENT_TYPE_ELM')).toContainText('Full (Layer 3)')
    await page.click('#B3730320750239994')
    await expect(page.locator('#contextleft > h3')).toHaveText('Case ID - Offender Information (Layer 3)')
}
