import { expect, type Page } from '@playwright/test'
import { selectOption } from '../utils/inputs'
import { findOffenderByCRN } from '../offender/find-offender'
import { doUntil } from '../utils/refresh'

export async function createRegistration(
    page: Page,
    crn: string,
    registrationType: string,
    registeringOfficerProvider?: string
): Promise<{ deliusRegtype: string; deliusRegDate: string; deliusRegNextReviewDate: string }> {
    await findOffenderByCRN(page, crn)
    await page.locator('a', { hasText: 'Personal Details' }).click()
    await page.locator('a', { hasText: 'Registration Summary' }).click()
    await expect(page).toHaveTitle('Register Summary')
    await page.locator('input', { hasText: 'Add Registration' }).click()
    await expect(page).toHaveTitle('Add Registration')

    if (registrationType === 'Integrated Offender Management') {
        await selectOption(page, '#Trust\\:selectOneMenu', registeringOfficerProvider)
        await selectOption(page, '#RegisterType\\:selectOneMenu', registrationType)
        await selectOption(page, '#Team\\:selectOneMenu')
        await selectOption(page, '#Staff\\:selectOneMenu')
        await selectOption(page, '#Category\\:selectOneMenu', 'IOM - Fixed')
    } else {
        await selectOption(page, '#Trust\\:selectOneMenu')
        await selectOption(page, '#RegisterType\\:selectOneMenu', registrationType)
        await selectOption(page, '#Team\\:selectOneMenu')
        await selectOption(page, '#Staff\\:selectOneMenu')
    }

    const saveBtn = page.locator('input', { hasText: 'Save' })
    await doUntil(
        () => saveBtn.click(),
        () => expect(page.locator('tbody tr')).toContainText(registrationType)
    )

    // Find the table row (tr) elements within the table body (tbody)
    const tableRows = await page.$$('#registrationTable tbody tr')

    // Extract text from the first row
    const [deliusRegtype, deliusRegDate, deliusRegNextReviewDate] = await Promise.all(
        [
            tableRows[0].$('td:nth-child(3)'), // Selecting the Type column (3rd td)
            tableRows[0].$('td:nth-child(4)'), // Selecting the Date column (4th td)
            tableRows[0].$('td:nth-child(5)'), // Selecting the Next Review column (5th td)
        ].map(async cell => {
            return cell ? await (await cell).innerText() : '' // Extract inner text of the cell if it exists, otherwise return an empty string
        })
    )
    return { deliusRegtype, deliusRegDate, deliusRegNextReviewDate }
}
