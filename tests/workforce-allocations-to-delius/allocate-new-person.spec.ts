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
import { Allocation, data } from '../../test-data/test-data'
import { chromium, test } from '@playwright/test'
import { createInitialAppointment } from '../../steps/delius/contact/create-contact'

test.beforeEach(async ({ page }) => {
    await login(page)
})

// Define the staff and team we will be allocating cases to:
const practitioner: Allocation = { staff: data.staff.allocationsTester1, team: data.teams.allocationsTestTeam }
// and another staff member in the same team, for currently/previously allocated cases:
const anotherPractitioner: Allocation = { staff: data.staff.allocationsTester2, team: data.teams.allocationsTestTeam }
// get all the crns
const crns: string[] = []

const successful = async (crn: string): Promise<void> => {
    const index = crns.indexOf(crn)
    if (index > -1) {
        crns.splice(index, 1)
    }
}

test('Allocate new person', async ({ page }) => {
    test.slow()
    // Given a new person in Delius, with an unallocated event and requirement in the allocations testing team
    const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam.provider })
    crns.push(crn)
    await createCommunityEvent(page, {
        crn,
        allocation: {
            team: data.teams.allocationsTestTeam,
            staff: data.staff.unallocated,
        },
    })
    await createRequirementForEvent(page, { crn, team: data.teams.allocationsTestTeam })
    await createInitialAppointment(page, crn, '1', data.teams.allocationsTestTeam)

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)

    // Then the allocation and associated contacts appear in Delius
    await verifyAllocation(page, { crn, allocation: practitioner })
    await verifyContacts(page, crn, [
        contact('Person', 'Community Practitioner Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('1 - Curfew (Police Checks Only) (Curfew) (6 Weeks)', 'Sentence Component Transfer', practitioner),
        contact('1 - ORA Community Order', 'Order Supervisor Transfer', practitioner),
        contact('1 - ORA Community Order', 'Case Allocation Decision Evidence', practitioner),
    ])
    await successful(crn)
})

test('Allocate currently-managed person', async ({ page }) => {
    test.slow()
    // Given an existing person in Delius, with a currently allocated un-sentenced event
    const crn = await createOffender(page, { providerName: anotherPractitioner.team.provider })
    crns.push(crn)
    await createEvent(page, { crn, event: data.events.appeal, allocation: { team: data.teams.allocationsTestTeam } })
    await internalTransfer(page, { crn, allocation: { team: data.teams.allocationsTestTeam } })

    // And a new unallocated event
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam } })
    await createInitialAppointment(page, crn, '2', data.teams.allocationsTestTeam)

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)
    await verifyAllocation(page, { crn, allocation: practitioner })

    // Then the allocation and associated contacts appear in Delius
    await verifyContacts(page, crn, [
        contact('Person', 'Community Practitioner Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('2 - ORA Community Order', 'Order Supervisor Transfer', practitioner),
        contact('2 - ORA Community Order', 'Case Allocation Decision Evidence', practitioner),
    ])
    await successful(crn)
})

test('Allocate previously-managed person', async ({ page }) => {
    test.slow()
    // Given an existing person in Delius, with a previously allocated (now terminated) community event
    const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam.provider })
    crns.push(crn)
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam } })
    await internalTransfer(page, { crn, allocation: anotherPractitioner })
    await terminateEvent(page, crn, '1', 'Completed - early good progress')

    // And a new unallocated event and requirement
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam } })
    await createRequirementForEvent(page, { crn, eventNumber: 2, team: data.teams.allocationsTestTeam })
    await createInitialAppointment(page, crn, '2', data.teams.allocationsTestTeam)

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)

    // Then the allocation and associated contacts appear in Delius
    await verifyAllocation(page, { crn, allocation: practitioner })
    await verifyContacts(page, crn, [
        contact('Person', 'Community Practitioner Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('2 - Curfew (Police Checks Only) (Curfew) (6 Weeks)', 'Sentence Component Transfer', practitioner),
        contact('2 - ORA Community Order', 'Order Supervisor Transfer', practitioner),
    ])
    await successful(crn)
})

//If any test fails, allocate in Delius to prevent allocations lists continually build up
test.afterAll(async () => {
    test.slow()
    if (crns.length > 0) {
        const browser = await chromium.launch()
        const page = await browser.newPage()

        for (const crn of crns) {
            try {
                await internalTransfer(page, { crn, allocation: anotherPractitioner })
            } catch (error) {
                console.error(`Error occurred during internal transfer: ${error}`)
            }
        }
        await page.close()
        await browser.close()
    }
})
