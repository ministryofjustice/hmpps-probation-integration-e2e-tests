import { type Page } from '@playwright/test'

export const complete2OffenceAnalysisSection = async (page: Page) => {
    await page
        .getByLabel('Brief offence(s) details (indicate what exactly happened, when, where and how)')
        .fill('OPD Autotest')
    await page.getByRole('table', { name: 'question 2.2' }).getByLabel('Carrying or using a weapon').selectOption('No')
    await page
        .getByRole('row', { name: 'Any violence or threat of violence / coercion' })
        .getByLabel('Any violence or threat of')
        .selectOption('No')
    await page
        .getByRole('row', { name: 'Excessive use of violence / sadistic violence' })
        .getByLabel('Excessive use of violence / sadistic violence')
        .selectOption('No')
    await page.getByRole('row', { name: 'Arson' }).getByLabel('Arson').selectOption('No')
    await page.getByRole('table', { name: 'question 2.2' }).getByLabel('Physical damage to property').selectOption('No')
    await page.getByRole('table', { name: 'question 2.2' }).getByLabel('Sexual element').selectOption('No')
    await page.getByRole('table', { name: 'question 2.2' }).getByLabel('Domestic abuse').selectOption('No')
    await page.getByLabel('Victim - perpetrator relationship').fill('OPD Autotest')
    await page.getByLabel('Any other information of specific note, consider vulnerability').fill('OPD Autotest')
    await page.getByLabel('Impact on the victim (Note any particular consequences)').fill('OPD Autotest')
    await page
        .getByLabel(
            'Does the offender recognise the impact and consequences of offending on victim, community / wider society'
        )
        .selectOption('No')
}
