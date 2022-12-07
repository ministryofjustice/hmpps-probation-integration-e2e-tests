import { type Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { selectOption } from '../utils/inputs.js'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { waitForAjax } from '../utils/refresh.js'

export async function createRegistration(page: Page, crn: string, registrationType: string) {
    await findOffenderByCRN(page, crn)
    await page.locator('a', { hasText: 'Personal Details' }).click()
    await page.locator('a', { hasText: 'Registration Summary' }).click()
    await expect(page).toHaveTitle('Register Summary')
    await page.locator('input', { hasText: 'Add Registration' }).click()
    await expect(page).toHaveTitle('Add Registration')
    await selectOption(page, '#addRegistrationForm\\:Trust', 'NPS London')
    await waitForAjax(page)
    await selectOption(page, '#addRegistrationForm\\:RegisterType', registrationType)
    await waitForAjax(page)
    await selectOption(page, '#addRegistrationForm\\:Team')
    await waitForAjax(page)
    await selectOption(page, '#addRegistrationForm\\:Staff')
    const saveBtn = page.locator('input', { hasText: 'Save' })
    await saveBtn.click()
    //click a second time as ND screen refreshes and doesn't register first click
    await saveBtn.click()
    await expect(page.locator('tbody tr')).toContainText(registrationType)
}
