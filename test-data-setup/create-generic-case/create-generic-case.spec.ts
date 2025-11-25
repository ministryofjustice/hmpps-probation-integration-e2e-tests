import { test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCustodialEvent } from '../../steps/delius/event/create-event'
import {
    createAndBookPrisoner,
    createAndBookPrisonerWithoutDeliusLink,
    releasePrisoner,
} from '../../steps/api/dps/prison-api'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { addCourtHearing } from '../../steps/api/court-case/court-case-api'
import { hearingData } from '../../steps/court-case/hearing-data'
import { slow } from '../../steps/common/common'

test('Create a case in multiple systems', async ({ page }) => {
    slow()
    const person = deliusPerson()

    if (process.env.CREATE_DELIUS_RECORD === 'true') {
        await loginDelius(page)
        const crn = await createOffender(page, { person })
        if (process.env.CREATE_NOMIS_RECORD === 'true') {
            await createCustodialEvent(page, { crn })
            const { nomisId } = await createAndBookPrisoner(page, crn, person)
            await releasePrisoner(nomisId)
        }
        if (process.env.CREATE_OASYS_ASSESSMENT === 'true') {
            await oasysLogin(page, UserType.Booking)
            await createLayer3CompleteAssessment(page, crn, person)
            await addLayer3AssessmentNeeds(page)
        }
    } else {
        if (process.env.CREATE_NOMIS_RECORD === 'true') {
            const { nomisId } = await createAndBookPrisonerWithoutDeliusLink(page, person)
            await releasePrisoner(nomisId)
        }
        if (process.env.CREATE_OASYS_ASSESSMENT === 'true') {
            console.error('Cannot create OASys assessment without Delius record')
        }
    }
    if (process.env.CREATE_COURT_HEARING === 'true') {
        await addCourtHearing(hearingData(person))
    }
})
