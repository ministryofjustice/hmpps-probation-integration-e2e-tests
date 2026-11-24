import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from '../offender/find-offender'
import { selectOption } from '../utils/inputs'

export async function createLiferRegistration(page: Page, crn: string, provider: string) {
    await findOffenderByCRN(page, crn)
    await page.locator('a', { hasText: 'Personal Details' }).click()
    await page.locator('a', { hasText: 'Registration Summary' }).click()
    await expect(page).toHaveTitle('Register Summary')
    await page.getByRole('button', { name: 'Add Registration' }).click()
    await expect(page).toHaveTitle('Add Registration')
    await selectOption(page, '#Trust\\:selectOneMenu', provider)
    await selectOption(page, '#RegisterType\\:selectOneMenu', 'Lifer')
    await selectOption(page, '#Category\\:selectOneMenu', 'Lifer - Life Imprisonment')
    await selectOption(page, '#Level\\:selectOneMenu', 'Lifer - Supervised')
    await selectOption(page, '#Team\\:selectOneMenu')
    await selectOption(page, '#Staff\\:selectOneMenu')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page).toHaveTitle(/Register Summary|Cohorts/, { timeout: 60_000 })
}
