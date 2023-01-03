import { expect, type Page } from '@playwright/test'
import { selectOption, selectOptionAndWait } from '../utils/inputs.js'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { doUntil } from '../utils/refresh.js'

export async function createRegistration(page: Page, crn: string, registrationType: string) {
    await findOffenderByCRN(page, crn)
    await page.locator('a', { hasText: 'Personal Details' }).click()
    await page.locator('a', { hasText: 'Registration Summary' }).click()
    await expect(page).toHaveTitle('Register Summary')
    await page.locator('input', { hasText: 'Add Registration' }).click()
    await expect(page).toHaveTitle('Add Registration')
    await selectOptionAndWait(page, '#addRegistrationForm\\:Trust')
    await selectOptionAndWait(page, '#addRegistrationForm\\:RegisterType', registrationType)
    await selectOptionAndWait(page, '#addRegistrationForm\\:Team')
    await selectOption(page, '#addRegistrationForm\\:Staff')
    const saveBtn = page.locator('input', { hasText: 'Save' })
    await doUntil(
        () => saveBtn.click(),
        () => expect(page.locator('tbody tr')).toContainText(registrationType)
    )
}
