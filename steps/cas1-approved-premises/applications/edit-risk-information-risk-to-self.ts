import { type Page, expect } from '@playwright/test'

export const verifyRiskToSelfIsAsPerOASys = async (page: Page) => {
    await expect(page.getByLabel('Analysis of current or previous self-harm and/or suicide concerns')).toContainText(
        "OASys Question - 'R8.1 Suicide and / or Self-harm - Provide an analysis of any current or previous suicide and/or self-harm concerns, include any information from ACCT assessments (Assessments, Care in Custody and Teamwork)'"
    )
    await expect(page.getByLabel('Coping in custody / approved premises / hostel / secure hospital')).toContainText(
        "OASys Question - 'R8.2 Coping in custody / approved premises / hostel setting / secure hospital - Provide an analysis of the circumstances, relevant issues and need - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await expect(page.getByLabel('Analysis of vulnerabilities')).toContainText(
        "OASys Question - 'R8.3 - Vulnerability - Provide an analysis of any vulnerabilities:- what are the relevant issues and needs. - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await page.locator('.govuk-button', { hasText: /Save and continue/ }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Apply for an Approved Premises (AP) placement')
}
