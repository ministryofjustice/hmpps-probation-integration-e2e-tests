import { expect, test, type Page } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as sasLogin } from '../../steps/sas/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { data } from '../../test-data/test-data'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { searchForPerson } from '../../steps/sas/offender-record'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { acceptDutyToRefer, addDutyToReferDetails } from '../../steps/sas/duty-to-refer'
import { findContactsByCRN } from '../../steps/delius/contact/find-contacts'
import { refreshUntil } from '../../steps/delius/utils/refresh'

test('Creating and accepting a Duty to Refer referral in FAMA updates Delius', async ({ page, context }) => {
    // Given a new person in Delius with settled accommodation
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person, providerName: data.teams.allocationsTestTeam.provider })
    const address = { ...buildAddress(), accommodationType: 'Householder (Owner - freehold or leasehold)' }
    await createAddress(page, crn, address)
    await createCustodialEvent(page, { crn })

    const nomisId = await createAndBookPrisoner(page, crn, person)
    await releasePrisoner(nomisId.nomisId)

    await internalTransfer(page, {
        crn,
        allocation: { team: data.teams.allocationsTestTeam, staff: data.staff.automatedTestUser },
    })

    await sasLogin(page)
    await page.getByRole('link', { name: 'Settled housing secured', exact: true }).click()
    await searchForPerson(page, crn, person)
    await expect(page.locator('//dt[text()="CRN"]/../dd[1]')).toContainText(crn)
    await expect(page.locator('h1.govuk-heading-l')).toContainText(`${person.firstName} ${person.lastName}`)
    const addressLocator = page.locator('//tbody/tr/td[3]')
    await expect(addressLocator).toContainText(address.buildingNumber)
    await expect(addressLocator).toContainText(address.street)
    await expect(addressLocator).toContainText(address.cityName)
    await expect(addressLocator).toContainText(address.zipCode)

    // When Duty to Refer details are recorded in SAS
    const referralUrl = await addDutyToReferDetails(page, crn)

    // Then Delius receives a person contact linking to the recorded referral
    const deliusPage = await context.newPage()
    await deliusLogin(deliusPage)
    await verifyDutyToReferContact(deliusPage, crn, 'Created', referralUrl)

    // When the local authority accepts the referral, Delius receives an updated contact
    await acceptDutyToRefer(page)
    await verifyDutyToReferContact(deliusPage, crn, 'Updated', referralUrl)
})

const verifyDutyToReferContact = async (
    page: Page,
    crn: string,
    status: 'Created' | 'Updated',
    referralUrl: string
) => {
    await findContactsByCRN(page, crn)
    const contactType = `CAS Duty to Refer - ${status}`
    const contact = page.getByRole('row').filter({
        has: page.getByText(contactType, { exact: true }),
    })
    await refreshUntil(page, () => expect(contact).toBeVisible())
    await contact.getByTitle('Link to view the contact details.').click()
    await expect(page.locator('#content > h1')).toContainText('Contact Details')
    await expect(page.getByText(contactType, { exact: true })).toBeVisible()
    await expect(page.locator('[id="relatesTo:outputText"]')).toHaveText('Person')
    await expect(page.locator('#notes\\:notesFieldHTML')).toContainText(`For more details, click here: ${referralUrl}`)
}
