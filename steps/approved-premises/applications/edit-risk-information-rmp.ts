import { type Page, expect } from '@playwright/test'

export const verifyRMPInfoIsAsPerOASys = async (page: Page) => {
    await page.locator('a', { hasText: 'Risk management plan' }).click()
    await expect(page.getByLabel('Key information about current situation')).toContainText(
        /"(\w+) \w+ is currently in the community having received a Adult Custody \(voluntary supervision\) on the (\d+)\\\/(\d+)\\\/(\d+) for 6 months.*/
    )
    await expect(page.getByLabel('Further considerations')).toHaveText(
        "\"OASys Question - 'Further Considerations about Current Situation' - Answer Input - 'Currently in Custody at HMP Hewell - Mangement of Case under MAPPA Level 3'\""
    )
    await expect(page.getByLabel('Additional comments')).toHaveText(
        "\"OASys Question - 'Additional Comments'  - Answer Input - 'Test Additional Comments'\""
    )
    await expect(page.getByLabel('Contingency plans')).toHaveText(
        "\"OASys Question - 'Contingency Plans'  - Answer Input - 'Test Contingency Plans'\""
    )
    await expect(page.getByLabel('Victim safety planning')).toHaveText(
        "\"OASys Question - 'Victim Safety Planning'  - Answer Input - 'Test Victim Safety Planning'\""
    )
    await expect(page.getByLabel('Interventions and treatment')).toHaveText(
        "\"OASys Question - 'Interventions and Treatment'  - Answer Input - 'Test Interventions and Treatment'\""
    )
    await expect(page.getByLabel('Monitoring and control')).toHaveText(
        "\"OASys Question - 'Monitoring and Control'  - Answer Input - 'Test Monitoring and Control'\""
    )
    await expect(page.getByLabel('Supervision')).toHaveText(
        "\"OASys Question - 'Supervision' - Answer Input - 'Probation Officer, Education training and employment Officer, Prison Offender Supervisor'\""
    )
}
