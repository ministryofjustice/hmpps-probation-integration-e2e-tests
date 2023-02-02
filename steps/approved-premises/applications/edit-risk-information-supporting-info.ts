import {type Page, expect} from '@playwright/test'

export const verifySupportingInfoIsAsPerOASys = async (page: Page) => {
    await page.locator('a', {hasText: 'Supporting information'}).click()
    await expect(page.getByLabel('Accommodation issues contributing to risks of offending and harm')).toContainText(
        "\"OASys Question - 'Identify accommodation issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test accommodation issues'\""
    )
    await expect(page.getByLabel('Education, training and employability issues contributing to risks of offending and harm')).toHaveText(
        "\"OASys Question - 'Identify education, training and employability issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test education, training and employability issues'\""
    )
    await expect(page.getByLabel('Relationship issues contributing to risks of offending and harm')).toHaveText(
        "\"OASys Question - 'Identify relationship issues contributing to risks of offending and harm. Please include any positive factors. Child details are now recorded in the screening' - Answer Input - 'Identify relationship issues contributing to risks of offending and harm'\""
    )
}
