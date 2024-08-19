import { type Page, expect } from '@playwright/test'

export const completeRoSHSection5FullAnalysis = async (page: Page) => {
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText(
        /R6 Risk of serious harm to others - full analysis|R6\.2 Previous behaviour/
    )
}

export const completeRoSHSection5FullAnalysisYes = async (page: Page) => {
    await page
        .getByLabel(
            'Is there anything else about the offender that leads you to consider that a full analysis should be completed. If YES, give details below'
        )
        .selectOption({ label: 'Yes' })
    await page.fill('#textarea_R5_1_t', 'TBA - Full analysis to be written in detail')
    await page
        .getByLabel(
            'In your professional opinion, do you consider it appropriate to not undertake a full risk of harm analysis?'
        )
        .selectOption({ label: 'No' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#R2846717162014845 > h6')).toHaveText(
        'R6 Risk of serious harm to others - full analysis'
    )
}
