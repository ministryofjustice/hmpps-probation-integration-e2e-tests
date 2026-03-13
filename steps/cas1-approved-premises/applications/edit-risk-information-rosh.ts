import { type Page, expect } from '@playwright/test'

export const verifyRoSHSummaryIsAsPerOASys = async (page: Page) => {
    await expect(page.getByLabel('Who is at risk')).toContainText(
        "OASys Question - 'R10.1 Who is at risk.' - Answer Input - 'Child'"
    )
    await expect(page.getByLabel('What is the nature of the risk')).toContainText(
        "OASys Question - 'R10.2 - What is the nature of the risk' - Answer Input - 'Test Nature'"
    )
    await expect(page.getByLabel('Analysis of risk factors')).toContainText(
        "OASys Question - 'Further analysis of risk factors' - Answer Input - 'Test Risk Greatest'"
    )
    await expect(page.getByLabel('Strengths and protective factors')).toContainText(
        "OASys Question - 'R10.5 - What strengths and protective factors are actively present or could be developed and how will they mitigate the risk factors?' - Answer Input - 'Test Factors to mitigate the risk'"
    )
    await expect(page.getByLabel('Circumstances or situations where offending is most likely to occur')).toContainText(
        "OASys Question - 'R10.3 - In what circumstances or situations would offending be most likely to occur and are any of these currently present' - Answer Input - ' Test lifestyle deterioration & victim proximity circumstances'"
    )
    await page.locator('.govuk-button', { hasText: /Save and continue/ }).click()
    await expect(page.locator('#main-content h1')).toHaveText('Offence details')
}
