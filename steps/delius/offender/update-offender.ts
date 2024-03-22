import { expect, type Page } from '@playwright/test'
import { findOffenderByCRN } from './find-offender'
import { selectOption } from '../utils/inputs'
import { doUntil } from '../utils/refresh'

export async function setNomisId(page: Page, crn: string, nomisId: string) {
    await findOffenderByCRN(page, crn)
    await page.click('#navigation-include\\:linkNavigation2OffenderIndex')
    await expect(page).toHaveTitle(/Personal Details/)

    // Check if the NOMIS id is already set
    if ((await page.locator('#NOMS\\:outputText').textContent()) === nomisId) return

    await page.locator('input', { hasText: 'Update' }).click()
    await expect(page).toHaveTitle(/Update Personal Details/)
    await selectOption(page, '#identifierType\\:selectOneMenu', 'NOMS')
    await page.fill('#identifierValue\\:inputText', nomisId)
    await doUntil(
        () => page.locator('input', { hasText: 'Add/Update' }).click(),
        () => expect(page.locator('tbody')).toContainText(nomisId)
    )
    await page.locator('input', { hasText: 'Save' }).click()

    try {
        await expect(page).toHaveTitle(/Personal Details/)
    } catch (e) {
        // Sometimes clicking Save can fail with this error, if it does then try again
        const ole = await page.locator('span.text-danger', { hasText: /Entity could not be updated/ }).isVisible()
        if (ole) await setNomisId(page, crn, nomisId)
    }

    await expect(page.locator('#NOMS\\:outputText')).toContainText(nomisId)
}

export async function removeNomisId(page: Page, crn: string) {
    await findOffenderByCRN(page, crn)
    await page.click('#navigation-include\\:linkNavigation2OffenderIndex')
    await expect(page).toHaveTitle(/Personal Details/)

    // Check if the NOMIS id is already removed
    if ((await page.locator('#NOMS\\:outputText').textContent()) === '') return

    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page).toHaveTitle(/Update Personal Details/)

    await page.getByRole('row', { name: 'NOMS Number' }).getByRole('link', { name: 'Delete' }).click()
    await expect(page.getByRole('row', { name: 'NOMS Number' })).not.toBeAttached()

    await page.getByRole('button', { name: 'Save' }).click()

    try {
        await expect(page).toHaveTitle(/Personal Details/)
    } catch (e) {
        // Sometimes clicking Save can fail with this error, if it does then try again
        const ole = await page.locator('span.text-danger', { hasText: /Entity could not be updated/ }).isVisible()
        if (ole) await removeNomisId(page, crn)
    }

    await expect(page.locator('#NOMS\\:outputText')).toBeEmpty()
}
