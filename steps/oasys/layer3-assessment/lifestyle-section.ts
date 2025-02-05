import { expect, type Page } from '@playwright/test'

export const complete7LifestyleSection = async (page: Page) => {
    await page
        .getByLabel(
            'Community integration (Attachments to individual(s) or community groups.  Participation in organised activities not linked to offending, including prison, eg sports clubs, faith communities, etc) (Absence of any links = 2)'
        )
        .selectOption('7.1~1')
    await page.getByLabel('Recklessness and risk-taking behaviour').selectOption('7.5~2')
    await page
        .getByLabel(
            'Identify lifestyle issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill(
            "OASys Question - 'Identify lifestyle issues contributing to risks of offending and harm. Please include any positive factors.' - Answer Input - 'Test lifestyle issues contributing to risks of offending and harm'"
        )
    await page
        .getByLabel('Lifestyle and associates linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('7.98~YES')
    await page.getByLabel('Lifestyle and associates linked to offending behaviour').selectOption('7.99~YES')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('8 - Drug Misuse (Layer 3)')
}
