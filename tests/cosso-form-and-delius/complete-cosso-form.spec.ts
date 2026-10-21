import { expect, test } from '@playwright/test'
import { faker } from '@faker-js/faker'
import fs from 'fs'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deleteOffender } from '../../steps/delius/offender/delete-offender'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { setMobileNumber } from '../../steps/delius/offender/update-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createNsiForEvent, openNsiForUpdate } from '../../steps/delius/event/create-nsi'
import { createDocumentFromTemplate } from '../../steps/delius/document/create-document'
import { getPdfText } from '../../steps/delius/utils/pdf-utils'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { login as hmppsAuthLogin } from '../../steps/hmpps-auth/login'
import { completeCossoForm, publishCossoForm } from '../../steps/cosso/cosso-form'

let crn: string | undefined

test('Complete a CO SSO breach report', async ({ page }) => {
    // Given a case in Delius with an address, a mobile number, a sentence and a Court Work Requests NSI
    await deliusLogin(page)
    const person = deliusPerson()
    crn = await createOffender(page, { person })
    const address = buildAddress()
    await createAddress(page, crn, address)
    const mobileNumber = `07700900${faker.number.int({ min: 100, max: 999 })}`
    await setMobileNumber(page, crn, mobileNumber)
    await createCustodialEvent(page, { crn })
    await createNsiForEvent(page, crn, 1, { type: 'Court Work Requests', subType: 'Appeal' })
    await openNsiForUpdate(page)

    // When I create and publish a CO SSO breach report
    await createDocumentFromTemplate(page, 'Breach Report CO SSO Service')
    const popupPromise = page.waitForEvent('popup')
    await page.getByRole('link', { name: 'open in co sso service' }).click()
    const popup = await popupPromise
    await hmppsAuthLogin(popup)
    await completeCossoForm(popup, { crn, person, address, mobileNumber })
    await publishCossoForm(popup)
    await popup.close()

    // Then the document is updated in Delius
    await refreshUntil(page, () => expect(page.getByRole('link', { name: 'view', exact: true })).toBeVisible())
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('link', { name: 'view', exact: true }).click(),
    ])
    await download.saveAs(`downloads/${crn}-cosso-breach-report.pdf`)
    const pdf = await getPdfText(fs.readFileSync(`downloads/${crn}-cosso-breach-report.pdf`))
    expect(pdf).toContain(crn)
})

test.afterEach(async ({ page }) => {
    // Delete the offender, including its event, so test data doesn't build up in Delius
    if (!crn) return
    await deliusLogin(page)
    await deleteOffender(page, crn)
    crn = undefined
})
