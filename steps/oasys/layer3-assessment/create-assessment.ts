import { type Page, expect } from '@playwright/test'

export const createLayer3Assessment = async (page: Page) => {
    await page.locator('#P10_PURPOSE_ASSESSMENT_ELM').selectOption({ label: 'Review' })
    await expect(page.locator('#P10_ASSESSMENT_TYPE_ELM')).toContainText('Full (Layer 3)')
    await page.click('#B3730320750239994')
    await expect(page.locator('#contextleft > h3')).toHaveText('Case ID - Offender Information (Layer 3)')
}

export const clickRoSHScreeningSection1 = async (page: Page) => {
    await page.locator('a', { hasText: 'RoSH Screening' }).click()
    await page.locator('a[href *= "ROSHA1"]').click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Screening (Layer 3)')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText(
        'R1 Information from other sections of OASys and risk of serious harm to others - screening'
    )
}

export const clickRoSHSummary = async (page: Page) => {
    await page.locator('a', { hasText: 'RoSH Summary' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk of Serious Harm Summary (Layer 3)')
}

export const clickRiskManagementPlan = async (page: Page) => {
    await page.locator('a', { hasText: 'Risk Management Plan' }).click()
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk Management Plan (Layer 3)')
}
