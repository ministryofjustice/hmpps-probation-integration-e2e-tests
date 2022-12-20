import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from './find-offender.js'
import { selectOption } from '../utils/inputs.js'

export async function setNomisId(page: Page, crn: string, nomisId: string) {
    await findOffenderByCRN(page, crn)
    await page.click('#linkNavigation2OffenderIndex')
    await expect(page).toHaveTitle(/Personal Details/)

    await page.locator('input', { hasText: 'Update' }).click()
    await expect(page).toHaveTitle(/Update Personal Details/)
    await selectOption(page, '#updateOffenderForm\\:identifierType', 'NOMS')
    await page.fill('#updateOffenderForm\\:identifierValue', nomisId)
    await page.locator('input', { hasText: 'Add/Update' }).click()
    await page.locator('input', { hasText: 'Save' }).click()

    try {
        await expect(page).toHaveTitle(/Personal Details/)
    } catch (e) {
        const ole = await page.locator('span.text-danger', {
            hasText:
                'Entity could not be updated - it has been modified in another transaction since it was loaded. [DAOERR002]',
        })
        if (ole != null) {
            await setNomisId(page, crn, nomisId)
        }
    }
}