import { type Page, expect } from '@playwright/test'

export const complete9AlcoholMisuseSection = async (page: Page) => {
    await page.getByLabel('Motivation to tackle alcohol misuse (if applicable)').selectOption('9.5~1')
    await page
        .getByLabel(
            'Identify alcohol misuse issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Alcohol misuse issues linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('9.98~NO')
    await page.getByLabel('Alcohol misuse issues linked to offending behaviour').selectOption('9.99~YES')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('10 - Emotional Well-being (Layer 3)')
}
