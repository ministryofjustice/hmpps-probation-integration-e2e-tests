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

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a record in NOMIS, NDelius and OASys', async ({ page }) => {
    await loginDelius(page)
    const person = deliusPerson({ sex: 'Male', dob: null, lastName: null, firstName: null })
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })

    await createAndBookPrisoner(page, crn, person)

    await oasysLogin(page, UserType.Booking)
    await createLayer3CompleteAssessment(page, crn, person)
    await addLayer3AssessmentNeeds(page)
})