import { expect, type Page } from '@playwright/test'
import { selectOption, selectOptionAndWait } from '../utils/inputs'
import { findOffenderByCRN } from '../offender/find-offender'
import { doUntil } from '../utils/refresh'

export async function createRegistration(page: Page, crn: string, registrationType: string) {
    await findOffenderByCRN(page, crn)
    await page.locator('a', { hasText: 'Personal Details' }).click()
    await page.locator('a', { hasText: 'Registration Summary' }).click()
    await expect(page).toHaveTitle('Register Summary')
    await page.locator('input', { hasText: 'Add Registration' }).click()
    await expect(page).toHaveTitle('Add Registration')
    await selectOptionAndWait(page, '#Trust\\:selectOneMenu')
    await selectOptionAndWait(page, '#RegisterType\\:selectOneMenu', registrationType)
    await selectOptionAndWait(page, '#Team\\:selectOneMenu')
    await selectOption(page, '#Staff\\:selectOneMenu')
    const saveBtn = page.locator('input', { hasText: 'Save' })
    await doUntil(
        () => saveBtn.click(),
        () => expect(page.locator('tbody tr')).toContainText(registrationType)
    )
}
