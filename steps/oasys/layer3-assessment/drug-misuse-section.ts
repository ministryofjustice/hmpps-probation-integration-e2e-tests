import { expect, type Page } from '@playwright/test'

export const complete8DrugMisuseSection = async (page: Page) => {
    await page.getByLabel('Drugs ever misused (in custody or community)').selectOption('8.1~NO')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('9 - Alcohol Misuse (Layer 3)')
}
