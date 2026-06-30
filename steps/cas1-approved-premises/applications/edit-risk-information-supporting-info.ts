import { type Page, expect } from '@playwright/test'

export const verifySupportingInfoIsAsPerOASys = async (page: Page) => {
    await expect(page.getByLabel('Accommodation issues contributing to risks of offending and harm')).toContainText(
        "OASys Question - 'Identify accommodation issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test accommodation issues'"
    )
    await expect(page.getByLabel('Relationship issues contributing to risks of offending and harm')).toContainText(
        "OASys Question - 'Identify relationship issues contributing to risks of offending and harm. Please include any positive factors. Child details are now recorded in the screening' - Answer Input - 'Identify relationship issues contributing to risks of offending and harm'"
    )
    await expect(page.getByLabel('Lifestyle issues contributing to risks of offending and harm')).toContainText(
        "OASys Question - 'Identify lifestyle issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test lifestyle issues contributing to risks of offending and harm'"
    )
    await expect(page.getByLabel('Drug misuse issues contributing to risks of offending and harm')).toContainText(
        "OASys Question - 'Identify drug misuse issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test drug misuse issues'"
    )
    await expect(page.getByLabel('Alcohol misuse issues contributing to risks of offending and harm')).toContainText(
        "OASys Question - 'Identify alcohol misuse issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test drug alcohol misuse issues'"
    )
    await expect(
        page.getByLabel('Thinking / behavioural issues contributing to risks of offending and harm')
    ).toContainText(
        "OASys Question - 'Identify thinking / behavioural issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Thinking / behavioural issues'"
    )
    await page.locator('.govuk-button', { hasText: /Save and continue/ }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Risk management plan')
}
