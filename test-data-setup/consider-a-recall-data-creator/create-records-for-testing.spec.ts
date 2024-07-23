import { expect, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { createCommunityEvent, createCustodialEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner } from '../../steps/api/dps/prison-api'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { createRestrictions } from '../../steps/delius/restriction/create-restrictions'
import { createLicenceCondition } from '../../steps/delius/licence-condition/create-licence-condition'
import { createRelease } from '../../steps/delius/release/create-release'
import { createContact } from '../../steps/delius/contact/create-contact'
import { buildAddress, createAddress } from '../../steps/delius/address/create-address'
import { Yesterday } from '../../steps/delius/utils/date-time'

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a record in NOMIS, NDelius and OASys', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.genericTeam.provider,
    })

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

    await createCustodialEvent(page, { crn, allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff } })

    // And I create a Release
    await createRelease(page, crn)

    // And I create a Licence Condition
    const licenceCondition = await createLicenceCondition(page, crn)

    await createAndBookPrisoner(page, crn, person)

    await oasysLogin(page, UserType.Booking)
    await createLayer3CompleteAssessment(page, crn, person)
    await addLayer3AssessmentNeeds(page)
})