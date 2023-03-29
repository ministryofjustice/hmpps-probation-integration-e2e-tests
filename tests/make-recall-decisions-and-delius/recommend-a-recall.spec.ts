import {expect, Page, test} from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login.js'
import { login as makeRecallDecisionsLogin } from '../../steps/make-recall-decisions/login.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { enableContactFeatureFlag } from '../../steps/make-recall-decisions/flags.js'
import {
    searchForPersonToRecommend,
    startRecommendation, verifyContact,
    verifyLicenceCondition,
    verifyRecallOffenderDetails,
    verifyRecallOffendersAddress,
} from '../../steps/make-recall-decisions/start-recommendation.js'
import * as dotenv from 'dotenv'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address.js'
import { createCustodialEvent } from '../../steps/delius/event/create-event.js'
import { createLicenceCondition } from '../../steps/delius/licence-condition/create-licence-condition.js'
import { createRelease } from '../../steps/delius/release/create-release.js'
import {createContact} from "../../steps/delius/contact/create-contact.js";
import {Yesterday} from "../../steps/delius/utils/date-time.js";
import {verifyContacts} from "../../steps/delius/contact/find-contacts.js";
import {contact} from "../../steps/delius/utils/contact.js";
dotenv.config() // read environment variables into process.env

test('Make a recall recommendation', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const name = person.firstName + ' ' + person.lastName
    const crn = await createOffender(page, { person })

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
    await createCustodialEvent(page, { crn })

    // And I create a Release
    await createRelease(page, crn)

    // And I create a Licence Condition
    const licenceCondition = await createLicenceCondition(page, crn)

    //When I login to Recall System and Search for the person to recommend
    await makeRecallDecisionsLogin(page)
    await enableContactFeatureFlag(page)
    await searchForPersonToRecommend(page, crn, name)

    // Then I verify all the person's details are as per Delius
    await verifyRecallOffenderDetails(page, crn, person.dob, person.gender)
    await verifyRecallOffendersAddress(page, address.street, address.cityName, address.zipCode)
    await verifyLicenceCondition(page, licenceCondition)
    await verifyContact(page, contactDetails.type)
    await startRecommendation(page)

    // And I log back to Delius and verify the contact
    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('Person', 'Recommendation Started (Recall or No Recall)')])
})
