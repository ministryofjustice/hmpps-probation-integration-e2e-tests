import { expect, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login.js'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { deliusPerson } from '../../steps/delius/utils/person.js'
import { login as oasysLogin, UserType } from '../../steps/oasys/login.js'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs.js'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs.js'
import { createEvent } from '../../steps/delius/event/create-event.js'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'
import { navigateToDeliusOASysAssessments } from '../../steps/delius/contact/find-contacts.js'
import { refreshUntil } from '../../steps/delius/utils/refresh.js'
import { format } from 'date-fns'

dotenv.config() // read environment variables into process.env

test('Create an OASys assessment and verify the Delius Assessment Summary', async ({ page }) => {
    test.slow()
    await loginDelius(page)
    const dob = faker.date.birthdate({ min: 20, max: 30, mode: 'age' })
    const person = deliusPerson({ sex: 'Male', dob: dob })
    const crn = await createOffender(page, { person })
    await createEvent(page, {
        crn,
        event: {
            outcome: 'CJA - Std Determinate Custody',
            length: '120',
            mainOffence: 'Rape - 01900',
            subOffence: 'Rape of a female aged 16 or over - 01908',
            plea: 'Guilty',
            appearanceType: 'Sentence',
        },
    })

    // Create a assessment in OASys
    await oasysLogin(page, UserType.Assessment)
    await createLayer3CompleteAssessment(page, crn, person)
    await addLayer3AssessmentNeeds(page)

    await loginDelius(page)
    await navigateToDeliusOASysAssessments(page, crn)

    // Then Assessment summary is available in Delius
    await refreshUntil(page, () =>
        expect(page.locator('#assessmentsTable > tbody > tr')).toContainText(format(new Date(), 'dd/MM/yyyy'))
    )
})
