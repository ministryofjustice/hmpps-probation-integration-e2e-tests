import { login } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deleteOffender } from '../../steps/delius/offender/delete-offender'
import { verifyNoEvents } from '../../steps/delius/offender/verify-no-events'
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
import { test } from '@playwright/test'
import { createInitialAppointment } from '../../steps/delius/contact/create-contact'
import { slow } from '../../steps/common/common'

test.beforeEach(async ({ page }) => {
    await login(page)
})

// Define the staff and team we will be allocating cases to:
const practitioner: Allocation = { staff: data.staff.allocationsTester3, team: data.teams.allocationsTestTeam2 }
// and another staff member in the same team, for currently/previously allocated cases:
const anotherPractitioner: Allocation = { staff: data.staff.allocationsTester4, team: data.teams.allocationsTestTeam2 }
// and define the staff (SPO) who will perform the allocations
const spo: Allocation = { team: practitioner.team, staff: data.staff.automatedTestUser }

test('Allocate new person', async ({ page }) => {
    slow()

    // Given a new person in Delius, with an unallocated event and requirement in the allocations testing team
    const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam2.provider })
    test.info().annotations.push({ type: 'cleanup-crn', description: crn })
    await createCommunityEvent(page, {
        crn,
        allocation: {
            team: data.teams.allocationsTestTeam2,
            staff: data.staff.unallocated,
        },
    })
    await createRequirementForEvent(page, { crn, team: data.teams.allocationsTestTeam2 })
    await createInitialAppointment(page, crn, 1, data.teams.allocationsTestTeam2)

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)

    // Then the allocation and associated contacts appear in Delius
    await verifyAllocation(page, { crn, allocation: practitioner })
    await verifyContacts(page, crn, [
        contact('Person', 'Community Practitioner Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('1 - Curfew (Police Checks Only) (Curfew) (6 Weeks)', 'Sentence Component Transfer', practitioner),
        contact('1 - SA2020 Community Order', 'Order Supervisor Transfer', practitioner),
        contact('1 - SA2020 Community Order', 'Case Allocation: SPO Oversight', spo),
    ])
})

test('Allocate currently-managed person', async ({ page }) => {
    slow()

    // Given an existing person in Delius, with a currently allocated un-sentenced event
    const crn = await createOffender(page, { providerName: anotherPractitioner.team.provider })
    test.info().annotations.push({ type: 'cleanup-crn', description: crn })
    await createEvent(page, { crn, event: data.events.appeal, allocation: { team: data.teams.allocationsTestTeam2 } })
    await internalTransfer(page, {
        crn,
        allocation: { team: data.teams.allocationsTestTeam2 },
    })

    // And a new unallocated event
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam2 } })
    await createInitialAppointment(page, crn, 2, data.teams.allocationsTestTeam2)

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)
    await verifyAllocation(page, { crn, allocation: practitioner })

    // Then the allocation and associated contacts appear in Delius
    await verifyContacts(page, crn, [
        contact('Person', 'Community Practitioner Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('2 - SA2020 Community Order', 'Order Supervisor Transfer', practitioner),
        contact('2 - SA2020 Community Order', 'Case Allocation: SPO Oversight', spo),
    ])
})

test('Allocate previously-managed person', async ({ page }) => {
    slow()

    // Given an existing person in Delius, with a previously allocated (now terminated) community event
    const crn = await createOffender(page, { providerName: data.teams.allocationsTestTeam2.provider })
    test.info().annotations.push({ type: 'cleanup-crn', description: crn })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam2 } })
    await internalTransfer(page, { crn, allocation: anotherPractitioner })
    await terminateEvent(page, crn, '1', 'Completed - early good progress')

    // And a new unallocated event and requirement
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.allocationsTestTeam2 } })
    await createRequirementForEvent(page, { crn, eventNumber: 2, team: data.teams.allocationsTestTeam2 })
    await createInitialAppointment(page, crn, 2, data.teams.allocationsTestTeam2)

    // When I allocate the person to a practitioner in Manage A Workforce
    await workforceLogin(page)
    await allocateCase(page, crn, practitioner)

    // Then the allocation and associated contacts appear in Delius
    await verifyAllocation(page, { crn, allocation: practitioner })
    await verifyContacts(page, crn, [
        contact('Person', 'Community Practitioner Transfer', practitioner),
        contact('Person', 'Responsible Officer Change', practitioner),
        contact('2 - Curfew (Police Checks Only) (Curfew) (6 Weeks)', 'Sentence Component Transfer', practitioner),
        contact('2 - SA2020 Community Order', 'Order Supervisor Transfer', practitioner),
    ])
})

test.afterEach(async ({ browser }, testInfo) => {
    const crn = testInfo.annotations.find(annotation => annotation.type === 'cleanup-crn')?.description
    if (!crn) return

    const context = await browser.newContext()
    try {
        const page = await context.newPage()
        await login(page)
        try {
            await deleteOffender(page, crn)
            console.log(`Deleted test record: ${crn}`)
        } catch (error) {
            const validationError = page.getByRole('link', { name: 'Validation Errors', exact: true })
            if (
                (await page.getByRole('heading', { name: 'Delete Whole Record', exact: true }).isVisible()) &&
                (await validationError.isVisible())
            ) {
                console.warn(
                    `Whole-record deletion rejected for ${crn}: ${await validationError.locator('..').innerText()}`
                )
                await page.getByRole('button', { name: 'Close', exact: true }).click()
                try {
                    await verifyNoEvents(page)
                } catch (verificationError) {
                    throw new Error(`Could not verify event removal for ${crn}`, { cause: verificationError })
                }
                console.warn(`No active or terminated events remain for ${crn}; CRN may still exist`)
            } else {
                throw new Error(`Failed to delete test record ${crn}`, { cause: error })
            }
        }
    } finally {
        await context.close()
    }
})
