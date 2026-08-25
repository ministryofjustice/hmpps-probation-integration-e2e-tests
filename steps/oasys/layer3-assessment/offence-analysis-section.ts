import { type Page } from '@playwright/test'

export const complete2OffenceAnalysisSection = async (page: Page) => {
    await page
        .getByRole('row', { name: 'Sexual motivation' })
        .getByLabel('Sexual motivation')
        .selectOption('2.9_V2_SEXUAL~YES')
    await page
        .getByRole('row', { name: 'Financial motivation' })
        .getByLabel('Financial motivation')
        .selectOption('2.9_V2_FINANCIAL~NO')
    await page
        .getByRole('row', { name: 'Addiction / perceived needs' })
        .getByLabel('Addiction / perceived needs')
        .selectOption('2.9_V2_ADDICTION~NO')
    await page
        .getByRole('row', { name: 'Emotional state of offender' })
        .getByLabel('Emotional state of offender')
        .selectOption('2.9_V2_EMOTIONAL~YES')
    await page
        .getByRole('row', { name: 'Racial motivation or hatred of other identifiable group' })
        .getByLabel('Racial motivation or hatred of other identifiable group')
        .selectOption('2.9_V2_RACIAL~NO')
    await page
        .getByRole('row', { name: 'Thrill seeking' })
        .getByLabel('Thrill seeking')
        .selectOption('2.9_V2_THRILL~NO')
    await page.getByRole('row', { name: 'Other', exact: true }).getByLabel('Other').selectOption('2.9_V2_OTHER~NO')
    await page
        .getByLabel(
            'Analysis of offence issues linked to risk of serious harm, risks to the individual and other risks'
        )
        .selectOption('2.99~YES')
    await page
        .getByLabel(
            'Identify offence analysis issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .click()
    await page
        .getByLabel(
            'Identify offence analysis issues contributing to risks of offending and harm.  Please include any positive factors. - additional information spellcheck available'
        )
        .fill('OPD Autotest')
}
