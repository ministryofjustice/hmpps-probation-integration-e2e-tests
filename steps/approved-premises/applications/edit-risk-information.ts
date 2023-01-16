import { type Page, expect } from '@playwright/test'

export const verifyRoSHSummaryIsAsPerOASys = async (page: Page) => {
    await expect(page.getByLabel('Who is at risk')).toHaveText('"OASys Question - \'R10.1 Who is at risk.\' - Answer Input - \'Child\'"')
    await expect(page.getByLabel('What is the nature of the risk')).toHaveText('"OASys Question - \'R10.2 - What is the nature of the risk\' - Answer Input - \'Test Nature\'"')
    await expect(page.getByLabel('When is the risk likely to be the greatest')).toHaveText('"OASys Question - \'R10.3 - When is the risk likely to be greatest Consider the timescale and indicate whether risk is immediate or not. Consider the risks in custody as well as on release\' - Answer Input - \'Test Risk Greatest\'"')
    await expect(page.getByLabel('What circumstances are likely to increase risk')).toHaveText('"OASys Question - \'R10.4 What circumstances are likely to increase risk Describe factors, actions, events which might increase level of risk, now and in the future - \'Test Circumstances\'"')
}
