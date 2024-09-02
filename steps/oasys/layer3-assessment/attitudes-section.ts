import { type Page, expect } from '@playwright/test'

export const complete12AttitudesSection = async (page: Page) => {
    await page.getByLabel('Pro-criminal attitudes').selectOption('12.1~0')
    await page.getByLabel('Attitude towards staff (optional)').selectOption('12.3~0')
    await page.getByLabel('Attitude towards supervision / licence').selectOption('12.4~0')
    await page.getByLabel('Attitude towards community / society').selectOption('12.5~0')
    await page
        .getByLabel('Does the offender understand their motivation for offending (optional)')
        .selectOption('12.6~0')
    await page.getByLabel('Motivation to address offending behaviour').selectOption('12.8~0')
    await page.getByLabel('Hostile Orientation').selectOption('12.9~0')
    await page
        .getByLabel(
            'Identify issues about attitudes contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Attitudes linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('12.98~NO')
    await page.getByLabel('Attitudes linked to offending behaviour').selectOption('12.99~NO')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('13 - Health and Other Considerations (Layer 3)')
}
