import { type Page, expect } from '@playwright/test'

export const completeRiskManagementPlan = async (page: Page) => {
    await page.fill(
        '#textarea_RM28',
        "OASys Question - 'Further Considerations about Current Situation' - Answer Input - 'Currently in Custody at HMP Hewell - Mangement of Case under MAPPA Level 3'"
    )
    await page.fill(
        '#textarea_RM30',
        "OASys Question - 'Supervision' - Answer Input - 'Probation Officer, Education training and employment Officer, Prison Offender Supervisor'"
    )
    await page.fill(
        '#textarea_RM31',
        "OASys Question - 'Monitoring and Control'  - Answer Input - 'Test Monitoring and Control'"
    )
    await page.fill(
        '#textarea_RM32',
        "OASys Question - 'Interventions and Treatment'  - Answer Input - 'Test Interventions and Treatment'"
    )
    await page.fill(
        '#textarea_RM33',
        "OASys Question - 'Victim Safety Planning'  - Answer Input - 'Test Victim Safety Planning'"
    )
    await page.fill('#textarea_RM34', "OASys Question - 'Contingency Plans'  - Answer Input - 'Test Contingency Plans'")
    await page.fill(
        '#textarea_RM35',
        "OASys Question - 'Additional Comments'  - Answer Input - 'Test Additional Comments'"
    )
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('Summary Sheet (Layer 3)')
}
