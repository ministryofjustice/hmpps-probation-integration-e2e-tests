import { type Page, expect } from '@playwright/test'

export const verifyOffenceAnalysisIsAsPerOASys = async (page: Page) => {
    await page.locator('a', { hasText: 'Offence details' }).click()
    await expect(page.getByLabel('Offence analysis')).toContainText(
        '"OASys Question - \'2.1 Brief offence(s) details (indicate what exactly happened, when, where and how)\' - Answer Input - \'HRosh to Partners, medium to male peers & children\'"'
    )
    await expect(page.getByLabel('Victim - perpetrator relationship')).toHaveText(
        '"OASys Question - \'Victim - perpetrator relationship\' - Answer Input - \'Spouse\\/Partner - Live in"'
    )
    await expect(page.getByLabel('Other victim information')).toHaveText(
        '"OASys Question - \'Any other information of specific note, consider vulnerability\' - Answer Input - \'Test Other Information"'
    )
    await expect(page.getByLabel('Pattern of offending')).toHaveText(
        '"OASys Question - \'2.12 Pattern of offending (consider details of previous convictions)\'  - Answer Input - \'Test Pattern -  violence with some property offending\'"'
    )
    await expect(page.getByLabel('Impact on the victim')).toHaveText(
        '"OASys Question - \'2.5 Impact on the victim (Note any particular consequences)\'  - Answer Input - \'Test Impact - Very detrimental impact and sleeplessness\'"'
    )
    await expect(page.getByLabel('Motivation and triggers')).toHaveText(
        '"OASys Question - \'2.8 Why did it happen - evidence of motivation and triggers\'  - Answer Input - \'Test Motivation and Trigger - Alcohol & Drugs\'"'
    )
    await expect(page.getByLabel('Issues contributing to risks')).toHaveText(
        '"OASys Question - \'Identify offence analysis issues contributing to risks of offending and harm. Please include any positive factors.\'  - Answer Input - \'Test Contributions\'"'
    )
}
