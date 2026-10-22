import { expect, test } from '@playwright/test'
import fs from 'fs'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deleteOffender } from '../../steps/delius/offender/delete-offender'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createNsiForEvent, openNsiForUpdate } from '../../steps/delius/event/create-nsi'
import { createDocumentFromTemplate } from '../../steps/delius/document/create-document'
import { DeliusDateFormatter } from '../../steps/delius/utils/date-time'
import { getPdfText } from '../../steps/delius/utils/pdf-utils'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { login as hmppsAuthLogin } from '../../steps/hmpps-auth/login'
import { completeSuicideRiskForm, publishSuicideRiskForm } from '../../steps/suicide-risk-form/suicide-risk-form'

let crn: string | undefined

test('Complete a Suicide Risk Form', async ({ page }) => {
    // Given a case in Delius with an address, a sentence and a Court Work Requests NSI
    await deliusLogin(page)
    const person = deliusPerson()
    crn = await createOffender(page, { person })
    const address = buildAddress()
    await createAddress(page, crn, address)
    await createCustodialEvent(page, { crn })
    await createNsiForEvent(page, crn, 1, { type: 'Court Work Requests', subType: 'Appeal' })
    await openNsiForUpdate(page)

    // When I create and publish a Suicide Risk Form
    await createDocumentFromTemplate(page, 'Suicide Risk Service')
    const popupPromise = page.waitForEvent('popup')
    await page.getByRole('link', { name: 'open in suicide risk service' }).click()
    const popup = await popupPromise
    await hmppsAuthLogin(popup)
    await completeSuicideRiskForm(popup, { crn, person, address })
    await publishSuicideRiskForm(popup)
    await popup.close()

    // Then the document is updated in Delius
    await refreshUntil(page, () => expect(page.getByRole('link', { name: 'view', exact: true })).toBeVisible())
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('link', { name: 'view', exact: true }).click(),
    ])
    await download.saveAs(`downloads/${crn}-suicide-risk-form.pdf`)
    const pdf = await getPdfText(fs.readFileSync(`downloads/${crn}-suicide-risk-form.pdf`))
    expect(pdf).toContain(person.firstName)
    expect(pdf).toContain(person.lastName)
    expect(pdf).toContain(DeliusDateFormatter(person.dob))
    expect(pdf).toContain(address.street)
})

test.afterEach(async ({ page }) => {
    // Delete the offender, including its event, so test data doesn't build up in Delius
    if (!crn) return
    await deliusLogin(page)
    await deleteOffender(page, crn)
    crn = undefined
})
