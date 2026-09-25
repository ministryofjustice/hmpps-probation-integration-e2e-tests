import { test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { contact } from '../../steps/delius/utils/contact'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createCheckin, registerCaseInMPoP, reviewCheckinInMPoP } from '../../steps/manage-a-supervision/check-in'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { slow } from '../../steps/common/common'
import { data } from '../../test-data/test-data'
import { createRegistration } from '../../steps/delius/registration/create-registration'
import { createAndBookPrisoner } from '../../steps/api/dps/prison-api'
import { signAndlock } from '../../steps/oasys/layer1-assessment/sign-and-lock'
import { createLayer1CompleteAssessment } from '../../steps/oasys/layer1-assessment/create-layer1-assessment/create-layer1-assessment'

const person = deliusPerson()
const nomisIds = []
let crn: string

test('Check-in for an e-supervision appointment', async ({ page }) => {
    slow()
    // Given a case in Delius with an active event
    await deliusLogin(page)
    crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
    await internalTransfer(page, { crn, allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff } })
    await createCommunityEvent(page, { crn })

    // Create a registration in NDelius and an entry in NOMIS
    await createRegistration(page, crn, 'Integrated Offender Management', 'West Midlands Region')
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // The below has been added as to be able to do the check in journey a user must have a tier assigned to them.
    // Log in to OASys and create a layer 1 assessment for the case
    await oasysLogin(page, UserType.Booking)
    await createLayer1CompleteAssessment(page, crn, person, nomisId)
    await signAndlock(page)

    // When the e-supervision case is registered in MPoP
    const uuid = await registerCaseInMPoP(page, person, crn)

    // And the person checks in for their appointment
    await createCheckin(page, uuid, person)

    // And a practitioner reviews their check-in in MPoP
    await reviewCheckinInMPoP(page, crn)

    // Then I can see the contact in Delius
    await deliusLogin(page)
    await verifyContacts(page, crn, [contact('1 - SA2020 Community Order', 'Online check in completed')])
})
