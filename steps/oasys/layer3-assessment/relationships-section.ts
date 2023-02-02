import {type Page, expect} from '@playwright/test'

export const completeRelationshipsSection = async (page: Page) => {
    await page.getByLabel('Current relationship with close family members').selectOption({label: 'Missing'})
    await page.getByLabel('Experience of childhood').selectOption({label: '0-No problems'})
    await page.getByLabel('Current relationship status').selectOption({label: 'In a relationship living together'})
    await page.getByLabel('Current relationship with partner').selectOption({label: '2-Significant problems'})
    await page.getByLabel('Previous experience of close relationships').selectOption({label: '1-Some problems'})
    await page.getByLabel('Is there evidence of current or previous domestic abuse?').selectOption({label: 'No'})
    await page.locator('#itm_6_9').selectOption({label: 'No'})
    await page.getByLabel('Open the Sexual Offending Questions (please see the help-text)').selectOption({label: 'Yes'})
    await page.getByLabel('Emotional Congruence with Children/Feeling Closer to Children than Adults').selectOption({label: '2-Significant problems'})
    await page.fill(
        '#textarea_6_97',
        "OASys Question - 'Identify relationship issues contributing to risks of offending and harm. Please include any positive factors. Child details are now recorded in the screening' - Answer Input - 'Identify relationship issues contributing to risks of offending and harm'"
    )
    await page.getByLabel('Relationship issues linked to risk of serious harm, risks to the individual and other risks').selectOption({label: 'No'})
    await page.getByLabel('Relationship issues linked to offending behaviour').selectOption({label: 'Yes'})
    await page.keyboard.down('End')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('7 - Lifestyle and Associates (Layer 3)')
}
