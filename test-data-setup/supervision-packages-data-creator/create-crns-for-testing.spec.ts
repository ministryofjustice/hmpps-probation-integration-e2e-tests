import { Page, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { deliusPerson, Person } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import {
    createCommunityEvent,
    createCustodialEvent,
    createDeterminateCustodyEvent,
} from '../../steps/delius/event/create-event'
import { createAndBookPrisoner } from '../../steps/api/dps/prison-api'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { signAndlock } from '../../steps/oasys/layer3-assessment/sign-and-lock.js'
import { DateTime } from 'luxon'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'

const today = DateTime.now().setLocale('en-gb').toLocaleString(DateTime.DATE_SHORT)

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a case for a Male not eligible for final third', async ({ page }) => {
    const person = deliusPerson({ sex: 'Male', dob: DateTime.now().minus({ years: 25 }).toJSDate() })
    await createOffenderAndCompleteOasysAssessment(page, person)
})

test('Create a case for a Female not eligible for final third', async ({ page }) => {
    const person = deliusPerson({ sex: 'Female', dob: DateTime.now().minus({ years: 25 }).toJSDate() })
    await createOffenderAndCompleteOasysAssessment(page, person)
})

const createOffenderAndCompleteOasysAssessment = async (page: Page, person: Person) => {
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    await createCommunityEvent(page, { crn })
    // await createDeterminateCustodyEvent(page, { crn })

    // await internalTransfer(page, {
    //     crn,
    //     allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
    //     reason: 'Case Allocated to NPS',
    // })

    const { nomisId } = await createAndBookPrisoner(page, crn, person)

    await oasysLogin(page, UserType.Booking)

    await createLayer3CompleteAssessment(page, crn, person, 'Yes', nomisId, true)

    await signAndlock(page)
}
