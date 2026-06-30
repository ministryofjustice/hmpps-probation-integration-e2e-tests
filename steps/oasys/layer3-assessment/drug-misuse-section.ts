import { expect, type Page } from '@playwright/test'

export const complete8DrugMisuseSection = async (page: Page, drugMisuse: boolean = false) => {
    await page
        .getByLabel('Drugs ever misused (in custody or community)')
        .selectOption(drugMisuse ? '8.1~YES' : '8.1~NO')

    if (drugMisuse) {
        await page
            .getByLabel(
                'Identify drug misuse issues contributing to risks of offending and harm. Please include any positive factors.'
            )
            .fill(
                "OASys Question - 'Identify drug misuse issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test drug misuse issues'"
            )
        await page.getByLabel('Motivation to tackle drug misuse').selectOption({ label: '1-Some problems' })
        await page
            .getByLabel('Drug use and obtaining drugs a major activity / occupation')
            .selectOption({ label: '1-Some problems' })
        await page.getByLabel('Drug misuse issues linked to offending behaviour').selectOption('8.99~NO')
    }

    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('9 - Alcohol Misuse (Layer 3)')
}
