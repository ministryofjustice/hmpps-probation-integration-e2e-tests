import { type Page, expect } from '@playwright/test'

export const completeAccommodationSection = async (page: Page) => {
    await page.getByLabel('Currently of no fixed abode or in transient accommodation').selectOption({ label: 'Yes' })
    await page.getByLabel('Suitability of accommodation').selectOption({ label: '0-No problems' })
    await page.getByLabel('Permanence of accommodation').selectOption({ label: '1-Some problems' })
    await page.getByLabel('Suitability of location of accommodation').selectOption({ label: '2-Significant problems' })
    await page.fill(
        '#textarea_3_97',
        "OASys Question - 'Identify accommodation issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test accommodation issues'"
    )
    await page
        .getByLabel('Accommodation issues linked to risk of serious harm, risks to the individual & other risks')
        .selectOption({ label: 'Yes' })
    await page.getByLabel('Accommodation issues linked to offending behaviour').selectOption({ label: 'Yes' })
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('4 - Education, Training and Employability (Layer 3)')
}
