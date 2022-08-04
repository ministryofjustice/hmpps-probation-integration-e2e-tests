import { expect, test } from '@playwright/test'
import { login as dpsLogin } from '../../steps/dps/login'
import { login as deliusLogin } from '../../steps/delius/login'
import { selectOption } from '../../steps/delius/utils/inputs'
import { contact } from '../../steps/delius/utils/contact'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { deliusPerson } from '../../steps/delius/utils/person'
import { setNomisId } from '../../steps/delius/offender/update-offender'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'

const nomisIds = []

test('Create a new case note', async ({ page }) => {
    // Given a person with a sentenced event in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const event = await createCustodialEvent(page, { crn })

    // And a corresponding person and booking in NOMIS
    const nomisId = await createAndBookPrisoner(person)
    nomisIds.push(nomisId)
    await setNomisId(page, crn, nomisId)
    await page.goto(`${process.env.DPS_URL}/auth/sign-out`)

    // When I add a case note in DPS
    await dpsLogin(page)
    await page.goto(`${process.env.DPS_URL}/prisoner/${nomisId}/add-case-note`)
    await expect(page).toHaveTitle(/Add a case note - Digital Prison Services/)
    await selectOption(page, '#type', 'General')
    await selectOption(page, '#sub-type', 'Offender Supervisor Entry')
    await page.fill('#text', 'Case Note added by HMPPS Probation Integration end to end tests')
    await page.locator('button', { hasText: 'Save' }).click()
    await expect(page).toHaveTitle(/Case notes - Digital Prison Services/)
    await page.goto(`${process.env.DPS_URL}/auth/sign-out`)

    // Then the case note appears as a contact in delius
    await deliusLogin(page)
    await verifyContacts(page, crn, [contact(event.outcome, 'Case Notes')])
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
