import { Page, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { deliusPerson, Person } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { createCommunityEvent, createEvent } from '../../steps/delius/event/create-event'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { signAndlock } from '../../steps/oasys/layer3-assessment/sign-and-lock.js'
import { DateTime } from 'luxon'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { createLayer1CompleteAssessment } from '../../steps/oasys/layer1-assessment/create-layer1-assessment/create-layer1-assessment'

const nomisIds = []

test.beforeEach(async ({ page }) => {
    await loginDelius(page)
})

test('Create a case not eligible for final third', async ({ page }) => {
    const person = deliusPerson({ sex: 'Male', dob: DateTime.now().minus({ years: 25 }).toJSDate() })
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    await createCommunityEvent(page, { crn })

    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    await oasysLogin(page, UserType.Booking)
    await createLayer1CompleteAssessment(page, crn, person, nomisId, true, true)
    await signAndlock(page)
})

test('Create an NSD case eligible for final third', async ({ page }) => {
    const person = deliusPerson({ sex: 'Male', dob: DateTime.now().minus({ years: 25 }).toJSDate() })
    const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    await createEvent(page, {
        crn,
        event: {
            outcome: 'Adult Custody < 12m',
            length: '6',
            mainOffence: 'Stealing by an employee - 04100',
            subOffence: 'Stealing by an employee - 04100',
            plea: 'Guilty',
            appearanceType: 'Sentence',
        },
    })

    await internalTransfer(page, {
        crn,
        allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
        reason: 'Case Allocated to NPS',
    })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    await oasysLogin(page, UserType.Booking)
    await createLayer1CompleteAssessment(page, crn, person, nomisId, false, false)
    await signAndlock(page)
})

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
