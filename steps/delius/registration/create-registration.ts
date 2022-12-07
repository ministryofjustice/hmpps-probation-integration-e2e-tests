import { type Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { doUntil, waitForAjax } from '../utils/refresh.js'

export async function createRegistration(page: Page, crn: string, registrationType: string) {
    await findOffenderByCRN(page, crn)
    await page.locator('a', { hasText: 'Personal Details' }).click()
    await page.locator('a', { hasText: 'Registration Summary' }).click()
    await expect(page).toHaveTitle('Register Summary')
    await page.locator('input', { hasText: 'Add Registration' }).click()
    await expect(page).toHaveTitle('Add Registration')
    await Promise.all([selectOption(page, '#addRegistrationForm\\:Trust', 'NPS London'), waitForAjax(page)])
    await Promise.all([selectOption(page, '#addRegistrationForm\\:RegisterType', registrationType), waitForAjax(page)])
    await Promise.all([selectOption(page, '#addRegistrationForm\\:Team'), waitForAjax(page)])
    await selectOption(page, '#addRegistrationForm\\:Staff')
    const saveBtn = page.locator('input', { hasText: 'Save' })
    await doUntil(
        () => saveBtn.click(),
        () => expect(page.locator('tbody tr')).toContainText(registrationType)
    )
}
