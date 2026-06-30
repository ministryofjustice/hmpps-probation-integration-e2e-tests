import { login as deliusLogin } from '../../steps/delius/login'
import { data } from '../../test-data/test-data'
import { Page, test } from '@playwright/test'
import { slow } from '../../steps/common/common'
import { createOffender } from '../../steps/delius/offender/create-offender.js'
import { createCommunityEvent } from '../../steps/delius/event/create-event.js'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement.js'
import { createInitialAppointment } from '../../steps/delius/contact/create-contact.js'
import { createDocumentFromTemplate } from '../../steps/delius/document/create-document.js'
import { faker } from '@faker-js/faker'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { findEventByCRN } from '../../steps/delius/event/find-events'

test('Create case awaiting Allocation with multiple documents', async ({ page }) => {
    slow()
    await createCaseWithDocuments(page, 50)
})

const createCaseWithDocuments = async (page: Page, number: number) => {
    await deliusLogin(page)

    const crn = await createOffender(page, {
        providerName: data.teams.allocationsTestTeam.provider,
        person: {
            firstName: 'Doc',
            lastName: 'Holiday',
            sex: 'Male',
            dob: faker.date.birthdate({ min: 18, max: 69, mode: 'age' }),
        },
    })

    await createCommunityEvent(page, {
        crn,
        allocation: {
            team: data.teams.allocationsTestTeam,
            staff: data.staff.unallocated,
        },
    })

    await createRequirementForEvent(page, { crn, team: data.teams.allocationsTestTeam })
    await createInitialAppointment(page, crn, 1, data.teams.allocationsTestTeam)

    for (let i = 0; i < number; i++) {
        await findOffenderByCRN(page, crn)
        await findEventByCRN(page, crn, 1)
        await createDocumentFromTemplate(page)
    }
}
