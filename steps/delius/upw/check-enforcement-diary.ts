import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { waitForAjax } from '../utils/refresh'
import { getRowByContent, expectRowIsNotPresent } from '../utils/table'

export type CheckEnforcementDiaryOptions = {
    region: string
    team: string
    personFullName: string
    exists: boolean
}

export default async function checkEnforcementDiary(
    page: Page,
    { region, team, personFullName, exists }: CheckEnforcementDiaryOptions
): Promise<void> {
    await page.getByRole('link', { name: 'Officer Diary' }).click()
    await page.getByRole('link', { name: 'Enforcement Contacts' }).click()

    await page.locator('span.float-start:has-text("Enforcement Contacts")').waitFor()

    await selectOption(page, '#trust\\:selectOneMenu', region)
    await selectOption(page, '#team\\:selectOneMenu', team)
    await selectOption(page, '#officer\\:selectOneMenu', 'All Officers')
    await selectOption(page, '#allTeams\\:selectOneMenu', 'No')
    await selectOption(page, '#filter\\:selectOneMenu', 'Enforcement Action')

    await page.getByRole('button', { name: 'Search' }).click()

    await page.getByRole('link', { name: 'Date', description: 'Date' }).click()
    await waitForAjax(page)
    await page.getByRole('link', { name: 'Date', description: 'Date' }).click()
    await waitForAjax(page)

    if (exists) {
        const enforcementContactRow = await getRowByContent(page, 'enforcementContactTable', personFullName)
        await expect(enforcementContactRow).toBeVisible()
    } else {
        await expectRowIsNotPresent(page, 'enforcementContactTable', personFullName)
    }
}
