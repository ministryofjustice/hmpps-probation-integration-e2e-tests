import { type Page, expect } from '@playwright/test'

export const verifyRiskToSelfIsAsPerOASys = async (page: Page) => {
    await expect(page.getByLabel('Current concerns about self-harm or suicide')).toContainText(
        "OASys Question - '8.1.1 Are there any current concerns about suicide & self-harm - Ans: Test circumstances, relevant issues and needs regarding current concerns'"
    )
    await expect(page.getByLabel('Current concerns about Coping in Custody or Hostel')).toContainText(
        "OASys Question - 'R8.2.1 Are there any current concerns about coping in custody or Hostel settings - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await expect(page.getByLabel('Current concerns about Vulnerability')).toContainText(
        "OASys Question - 'R8.3.1 Are there any current concerns about vulnerability (eg victimisation, being bullied, assaulted, exploited) - Ans: Test circumstances, relevant issues and needs regarding current concerns"
    )
    await page.locator('.govuk-button', { hasText: /Save and continue/ }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Apply for an Approved Premises (AP) placement')
}
