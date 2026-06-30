import { type Page, expect } from '@playwright/test'

export const complete10EmotionalWellbeingSection = async (page: Page) => {
    await page.getByLabel('Difficulties coping').selectOption('10.1~1')
    await page.getByLabel('Current psychological problems / depression').selectOption('10.2~0')
    await page.getByLabel('Social isolation').selectOption('10.3~0')
    await page.getByLabel("Offender's attitude to themselves").selectOption('10.4~0')
    await page.getByLabel('Self-harm, attempted suicide, suicidal thoughts or feelings').selectOption('10.5~NO')
    await page.getByLabel('Current psychiatric problems').selectOption('10.6~0')
    await page
        .getByLabel('Evidence of childhood behavioural problems', { exact: true })
        .selectOption('10.7_V2_CHILDHOOD~NO')
    await page
        .getByLabel('History of severe head injuries, fits, periods of unconsciousness', { exact: true })
        .selectOption('10.7_V2_HISTHEADINJ~NO')
    await page.getByLabel('History of psychiatric treatment', { exact: true }).selectOption('10.7_V2_HISTPSYCH~NO')
    await page
        .getByRole('row', { name: 'Ever been on medication for mental health problems in the past' })
        .locator('div')
        .click()
    await page
        .getByLabel('Ever been on medication for mental health problems in the past', { exact: true })
        .selectOption('10.7_V2_MEDICATION~NO')
    await page
        .getByLabel('Previously failed to co-operate with psychiatric treatment', { exact: true })
        .selectOption('10.7_V2_FAILEDTOCOOP~NO')
    await page
        .getByLabel('Ever been a patient in a Special Hospital or Regional Secure Unit', { exact: true })
        .selectOption('10.7_V2_PATIENT~NO')
    await page
        .getByRole('row', { name: 'Current psychiatric treatment or treatment pending' })
        .getByLabel('Current psychiatric treatment or treatment pending')
        .selectOption('10.7_V2_PSYCHTREAT~NO')
    await page.getByLabel('Is a Specialist Report required?').selectOption('10.8~NO')
    await page
        .getByLabel(
            'Identify any issues of emotional well-being contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
    await page
        .getByLabel(
            'Issues of emotional wellbeing linked to risk of serious harm, risks to the individual and other risks'
        )
        .selectOption('10.98~NO')
    await page.getByLabel('Issues of emotional wellbeing linked to offending behaviour').selectOption('10.99~NO')
    await page.click('input[value="Save"]')
    await page.click('input[value="Next"]')
    await expect(page.locator('#contextleft > h3')).toHaveText('11 - Thinking and Behaviour (Layer 3)')
}
