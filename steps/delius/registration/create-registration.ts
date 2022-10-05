import { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { findOffenderByCRN } from '../offender/find-offender'

export async function createRegistration(page: Page, crn: string, registrationType: string) {
    await findOffenderByCRN(page, crn)
    await page.locator('a', { hasText: 'Personal Details' }).click()
    await page.locator('a', { hasText: 'Registration Summary' }).click()
    await expect(page).toHaveTitle('Register Summary')
    await page.locator('input', { hasText: 'Add Registration' }).click()
    await expect(page).toHaveTitle('Add Registration')
    await selectOption(page, '#addRegistrationForm\\:Trust', 'NPS London')
    await selectOption(page, '#addRegistrationForm\\:RegisterType', registrationType)
    await selectOption(page, '#addRegistrationForm\\:Team')
    await selectOption(page, '#addRegistrationForm\\:Staff')
    await page.locator('input', { hasText: 'Save' }).click()
    await expect(page.locator('tbody tr')).toContainText(registrationType)
}
