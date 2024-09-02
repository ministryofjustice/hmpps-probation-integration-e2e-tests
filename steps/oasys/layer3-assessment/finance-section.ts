import { type Page, expect } from '@playwright/test'

export const complete5FinanceSection = async (page: Page) => {
    await page.getByLabel('Severe impediment to budgeting (optional)').selectOption('5.6~1')
    await page
        .getByLabel(
            'Identify financial management issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Financial issues linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('5.98~NO')
    await page.getByLabel('Financial issues linked to offending behaviour').selectOption('5.99~NO')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('6 - Relationships (Layer 3)')
}
