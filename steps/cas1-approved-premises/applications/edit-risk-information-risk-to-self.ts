import { type Page, expect } from '@playwright/test'

export const verifyRiskToSelfIsAsPerOASys = async (page: Page) => {
    await expect(page.getByLabel('Current concerns about self-harm or suicide')).toContainText(
        "OASys Question - 'Describe circumstances, relevant issues and needs regarding current concerns (refer to sections 1-12 for indicators, particularly Section 1' - Answer Input - 'Test concerns about self-harm and suicide'"
    )
    await expect(page.getByLabel('Current concerns about Coping in Custody or Hostel')).toContainText(
        "OASys Question - 'R8.2 Coping in custody / hostel setting - Describe circumstances, relevant issues and needs' - Answer Input - 'Test Issues and Needs'"
    )
    await expect(page.getByLabel('Current concerns about Vulnerability')).toContainText(
        "OASys Question - 'R8.3.1 Are there any current concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited) - Yes - Describe circumstances, relevant issues and needs' - Answer Input - 'Test Issues and Needs'"
    )
    await page.locator('.govuk-button', { hasText: /Save and continue/ }).click()
}
