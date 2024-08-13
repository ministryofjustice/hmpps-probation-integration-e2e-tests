import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as makeRecallDecisionsLogin, loginAsSupervisor, logout } from '../../steps/make-recall-decisions/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import {
    makeManagementOversightDecision,
    recommendAPersonForRecall,
    searchForPersonToRecommend,
    verifyContact,
    verifyLicenceCondition,
    verifyRecallOffenderDetails,
    verifyRecallOffendersAddress,
} from '../../steps/make-recall-decisions/start-recommendation'
import * as dotenv from 'dotenv'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import { createLicenceCondition } from '../../steps/delius/licence-condition/create-licence-condition'
import { createRelease } from '../../steps/delius/release/create-release'
import { createContact } from '../../steps/delius/contact/create-contact'
import { Yesterday } from '../../steps/delius/utils/date-time'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'
import { data } from '../../test-data/test-data'
import { refreshUntil } from '../../steps/delius/utils/refresh'
dotenv.config() // read environment variables into process.env

test('Make a Management Oversight Decision and verify in Delius', async ({ page }) => {
    test.slow()
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const name = person.firstName + ' ' + person.lastName
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    // And I create an Address
    const address = buildAddress()
    await createAddress(page, crn, address)

    // And I create a Contact
    const contactDetails = {
        category: 'Community Management',
        type: 'Other Contact',
        relatesTo: `Person - ${person.firstName} ${person.lastName}`,
        date: Yesterday,
    }
    await createContact(page, crn, contactDetails)

    // And I create a Custodial Event
    await createCustodialEvent(page, {
        crn,
        allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff },
    })

    // And I create a Release
    await createRelease(page, crn)

    // And I create a Licence Condition
    const licenceCondition = await createLicenceCondition(page, crn)

    // When I login to Recall System and Search for the person to recommend
    await makeRecallDecisionsLogin(page)
    await searchForPersonToRecommend(page, crn, name)

    // Then I verify all the person's details are as per Delius
    await verifyRecallOffenderDetails(page, crn, person.dob, person.sex)
    await verifyRecallOffendersAddress(page, address.street, address.cityName, address.zipCode)
    await verifyLicenceCondition(page, licenceCondition)
    await verifyContact(page, contactDetails.type)

    // And I Recommend the Person for Recall as practitioner
    const caseLinkSharedByPO = await recommendAPersonForRecall(page)

    // And I logout as practitioner and login as Supervisor
    await logout(page)
    await loginAsSupervisor(page)

    // And I Make a Management Oversight Decision as a Supervisor
    await makeManagementOversightDecision(page, caseLinkSharedByPO)

    // Then I log back to Delius and verify the contact
    await deliusLogin(page)
    await refreshUntil(page, () => verifyContacts(page, crn, [contact('Person', 'Management Oversight - Recall')]), {
        timeout: 120_000,
    })
})
