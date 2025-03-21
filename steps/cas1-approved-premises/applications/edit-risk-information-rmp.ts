import { type Page, expect } from '@playwright/test'

export const verifyRMPInfoIsAsPerOASys = async (page: Page) => {
    await expect(page.getByLabel('Further considerations')).toContainText(
        "OASys Question - 'Further Considerations about Current Situation' - Answer Input - 'Currently in Custody at HMP Hewell - Mangement of Case under MAPPA Level 3'"
    )
    await expect(page.getByLabel('Key information about current situation')).toContainText(
        'They have analysis of offence, lifestyle & associates and thinking\\behaviour linked to risk.'
    )
    await expect(page.getByLabel('Supervision')).toContainText(
        "OASys Question - 'Supervision' - Answer Input - 'Probation Officer, Education training and employment Officer, Prison Offender Supervisor'"
    )
    await expect(page.getByLabel('Monitoring and control')).toContainText(
        "OASys Question - 'Monitoring and Control'  - Answer Input - 'Test Monitoring and Control'"
    )
    await expect(page.getByLabel('Interventions and treatment')).toContainText(
        "OASys Question - 'Interventions and Treatment'  - Answer Input - 'Test Interventions and Treatment'"
    )
    await expect(page.getByLabel('Victim safety planning')).toContainText(
        "OASys Question - 'Victim Safety Planning'  - Answer Input - 'Test Victim Safety Planning'"
    )
    await expect(page.getByLabel('Contingency plans')).toContainText(
        "OASys Question - 'Contingency Plans'  - Answer Input - 'Test Contingency Plans'"
    )
    await expect(page.getByLabel('Additional comments')).toContainText(
        "OASys Question - 'Additional Comments'  - Answer Input - 'Test Additional Comments'"
    )
    await page.locator('.govuk-button', { hasText: /Save and continue/ }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Risk to self and vulnerabilities')
}
