import { expect, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { createEvent } from '../../steps/delius/event/create-event'
import { faker } from '@faker-js/faker'
import { navigateToDeliusOASysAssessments } from '../../steps/delius/contact/find-contacts'
import { refreshUntil } from '../../steps/delius/utils/refresh'
import { slow } from '../../steps/common/common'
import { signAndlock } from '../../steps/oasys/layer3-assessment/sign-and-lock'
import { formatDate } from '../../steps/delius/utils/date-time'
import { DateTime } from 'luxon'

test('Create an OASys assessment and verify the Delius Assessment Summary', async ({ page }) => {
    slow()

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
    await createLayer3CompleteAssessment(page, crn, person, 'Yes')
    await signAndlock(page)

    await loginDelius(page)
    await navigateToDeliusOASysAssessments(page, crn)

    // Then Assessment summary is available in Delius
    await refreshUntil(
        page,
        () =>
            expect(page.locator('#assessmentsTable > tbody > tr')).toContainText(
                formatDate(DateTime.now(), 'dd/MM/yyyy')
            ),
        { timeout: 120_000 }
    )
})
