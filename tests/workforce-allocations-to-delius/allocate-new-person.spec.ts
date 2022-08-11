import { login } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent, createEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { login as workforceLogin } from '../../steps/workforce/login'
import { allocateCase } from '../../steps/workforce/allocations'
import { verifyAllocation } from '../../steps/delius/offender/find-offender'
import { verifyContacts } from '../../steps/delius/contact/find-contacts'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { terminateEvent } from '../../steps/delius/event/terminate-events'
import { contact } from '../../steps/delius/utils/contact'
import { data } from '../../test-data/test-data'
import { Practitioner } from '../../steps/delius/utils/person'
import { test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await login(page)
})

// Define the staff and team we will be allocating cases to:
const practitioner: Practitioner = { ...data.staff.allocationsTester1, ...data.teams.allocationsTestTeam }
// and another staff member in the same team, for currently/previously allocated cases:
const anotherPractitioner: Practitioner = { ...data.staff.allocationsTester2, ...data.teams.allocationsTestTeam }

test('Allocate new person', async ({ page }) => {
    // Given a new person in Delius, with an unallocated event and requirement in the allocations testing team
    const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam.providerName })
    await createCommunityEvent(page, { crn, allocation: data.teams.allocationsTestTeam })
    await createRequirementForEvent(page, { crn, team: data.teams.allocationsTestTeam })

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)

    // Then the allocation and associated contacts appear in Delius
    await verifyAllocation(page, { crn, practitioner })
    await verifyContacts(page, crn, [
        contact('Person', 'Offender Manager Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('1 - Curfew (Curfew) (6 Weeks)', 'Sentence Component Transfer', practitioner),
        contact('1 - ORA Community Order', 'Order Supervisor Transfer', practitioner),
    ])
})

test('Allocate currently-managed person', async ({ page }) => {
    // Given an existing person in Delius, with a currently allocated un-sentenced event
    const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam.providerName })
    await createEvent(page, { crn, event: data.events.appeal, allocation: data.teams.allocationsTestTeam })
    await internalTransfer(page, { crn, allocation: anotherPractitioner })

    // And a new unallocated event
    await createCommunityEvent(page, { crn, allocation: data.teams.allocationsTestTeam })

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)
    await verifyAllocation(page, { crn, practitioner })

    // Then the allocation and associated contacts appear in Delius
    await verifyContacts(page, crn, [
        contact('Person', 'Offender Manager Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('2 - ORA Community Order', 'Order Supervisor Transfer', practitioner),
    ])
})

test('Allocate previously-managed person', async ({ page }) => {
    // Given an existing person in Delius, with a previously allocated (now terminated) community event
    const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam.providerName })
    await createCommunityEvent(page, { crn, allocation: data.teams.allocationsTestTeam })
    await internalTransfer(page, { crn, allocation: anotherPractitioner })
    await terminateEvent(page, crn, '1', 'Completed - early good progress')

    // And a new unallocated event and requirement
    await createCommunityEvent(page, { crn, allocation: data.teams.allocationsTestTeam })
    await createRequirementForEvent(page, { crn, eventNumber: 2, team: data.teams.allocationsTestTeam })

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)

    // Then the allocation and associated contacts appear in Delius
    await verifyAllocation(page, { crn, practitioner })
    await verifyContacts(page, crn, [
        contact('Person', 'Offender Manager Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('2 - Curfew (Curfew) (6 Weeks)', 'Sentence Component Transfer', practitioner),
        contact('2 - ORA Community Order', 'Order Supervisor Transfer', practitioner),
    ])
})
