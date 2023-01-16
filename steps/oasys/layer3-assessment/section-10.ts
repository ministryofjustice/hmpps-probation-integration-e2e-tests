import { type Page, expect } from '@playwright/test'

export const completeRoSHSection10RoSHSummary = async (page: Page) => {
    await page.fill('#textarea_SUM1', "OASys Question - 'R10.1 Who is at risk.' - Answer Input - 'Child'")
    await page.fill(
        '#textarea_SUM2',
        "OASys Question - 'R10.2 - What is the nature of the risk' - Answer Input - 'Test Nature'"
    )
    await page.fill(
        '#textarea_SUM3',
        "OASys Question - 'R10.3 - When is the risk likely to be greatest Consider the timescale and indicate whether risk is immediate or not. Consider the risks in custody as well as on release' - Answer Input - 'Test Risk Greatest'"
    )
    await page.fill(
        '#textarea_SUM4',
        "OASys Question - 'R10.4 What circumstances are likely to increase risk Describe factors, actions, events which might increase level of risk, now and in the future - 'Test Circumstances'"
    )
    await page.fill(
        '#textarea_SUM5',
        "OASys Question - 'R10.5 - What factors are likely to reduce the risk Describe factors, actions, and events which may reduce or contain the level of risk. What has previously stopped him / her? ' - Answer Input - 'Test Factors to reduce the risk'"
    )
    await page.locator('#itm_SUM6_1_1').selectOption({ label: 'Very High' })
    await page.locator('#itm_SUM6_2_1').selectOption({ label: 'Medium' })
    await page.locator('#itm_SUM6_3_1').selectOption({ label: 'High' })
    await page.locator('#itm_SUM6_4_1').selectOption({ label: 'Medium' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk Management Plan (Layer 3)')
}
