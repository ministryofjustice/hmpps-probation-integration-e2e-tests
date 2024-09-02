import { type Page, expect } from '@playwright/test'

export const complete11ThinkingAndBehaviourSection = async (page: Page) => {
    await page.getByLabel('Level of interpersonal skills').selectOption('11.1~1')
    await page.getByLabel('Impulsivity').selectOption('11.2~2')
    await page.getByLabel('Aggressive / controlling behaviour').selectOption('11.3~2')
    await page.getByLabel('Temper control').selectOption('11.4~1')
    await page.getByLabel('Ability to recognise problems').selectOption('11.5~2')
    await page.getByLabel('Problem solving skills').selectOption('11.6~2')
    await page.getByLabel('Awareness of consequences').selectOption('11.7~2')
    await page.getByLabel("Understands other people's views").selectOption('11.9~1')
    await page.getByLabel('Sexual Pre-Occupation').selectOption('11.11~1')
    await page.getByLabel('Offence Related Sexual Interests').selectOption('11.12~1')
    await page
        .getByLabel(
            'Identify thinking / behavioural issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .click()
    await page
        .getByLabel(
            'Identify thinking / behavioural issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel('Thinking and behaviour linked to risk of serious harm, risks to the individual and other risks')
        .selectOption('11.98~YES')
    await page.getByLabel('Thinking and behaviour linked to offending behaviour').selectOption('11.99~YES')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('12 - Attitudes (Layer 3)')
}
