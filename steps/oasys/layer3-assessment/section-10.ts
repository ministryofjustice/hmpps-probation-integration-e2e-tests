import { type Page, expect } from '@playwright/test'

export const completeRoSHSection10RoSHSummary = async (page: Page, highRoshScore: boolean = false) => {
    await page.fill('#textarea_SUM1', "OASys Question - 'R10.1 Who is at risk.' - Answer Input - 'Child'")
    await page.fill(
        '#textarea_SUM2',
        "OASys Question - 'R10.2 - What is the nature of the risk' - Answer Input - 'Test Nature'"
    )
    await page.fill(
        '#textarea_SUM9',
        "OASys Question - 'Further analysis of risk factors' - Answer Input - 'Test Risk Greatest'"
    )
    await page.fill(
        '#textarea_SUM10',
        "OASys Question - 'R10.5 - What strengths and protective factors are actively present or could be developed and how will they mitigate the risk factors?' - Answer Input - 'Test Factors to mitigate the risk'"
    )
    await page.fill(
        '#textarea_SUM11',
        "OASys Question - 'R10.3 - In what circumstances or situations would offending be most likely to occur and are any of these currently present' - Answer Input - ' Test lifestyle deterioration & victim proximity circumstances'"
    )
    await page.fill(
        '#textarea_SUM8',
        "OASys Question - 'If necessary record the details of any key documents or reports used in this analysis:' - Answer Input - ' Test documents'"
    )

    if (highRoshScore) {
        await page.locator('#itm_SUM6_1_1').selectOption({ label: 'Very High' })
        await page.locator('#itm_SUM6_2_1').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_3_1').selectOption({ label: 'High' })
        await page.locator('#itm_SUM6_4_1').selectOption({ label: 'Medium' })
    } else {
        await page.locator('#itm_SUM6_1_1').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_2_1').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_3_1').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_4_1').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_1_2').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_2_2').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_3_2').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_4_2').selectOption({ label: 'Medium' })
        await page.locator('#itm_SUM6_5_2').selectOption({ label: 'Medium' })
    }

    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('Risk Management Plan (Layer 3)')
}
