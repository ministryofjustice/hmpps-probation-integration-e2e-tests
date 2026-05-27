import { expect, Page, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { data } from '../../test-data/test-data'
import { createUpwProject } from '../../steps/delius/upw/create-upw-project'
import { allocateCurrentCaseToUpwProject } from '../../steps/delius/upw/allocate-current-case-to-upw-project'
import { loginAsCaseAdmin } from '../../steps/community-payback/login'
import {
    adjustTravelTime,
    findGroupSession,
    findAnIndividualPlacement,
    recordAttendanceCompliedOutcome,
    recordUnacceptableAbsenceOutcome,
    findAnAppointment,
} from '../../steps/community-payback/record-outcome'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'

test('Find a group session and update record as Attendance Complied', async ({ page }) => {
    // Given I create a new Offender in nDelius
    const testData = await createOffenderAndUpwProject(page)

    // And I create a new event and allocate the case to the project
    await createEventAndAllocateCaseToProject(page, testData.crn, testData.project.projectName)

    // Find a group session and update the record as Attendance Complied
    await loginAsCaseAdmin(page)
    await findGroupSession(
        page,
        testData.crn,
        testData.person,
        testData.project.projectName,
        data.teams.unpaidWorkTestTeam.provider,
        data.teams.unpaidWorkTestTeam.name
    )
    await recordAttendanceCompliedOutcome(page)

    // Log in to Delius to confirm record has been updated correctly
    await deliusLogin(page)
    await navigateToUnpaidWork(page, testData.crn)
    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await expect(page.locator('#appointmentsTable')).toContainText(/Attended - Complied/)
})

test('Find a group session and update record as Unacceptable Absence', async ({ page }) => {
    // Given I create a new Offender in nDelius
    const testData = await createOffenderAndUpwProject(page)

    // And I create a new event and allocate the case to the project
    await createEventAndAllocateCaseToProject(page, testData.crn, testData.project.projectName)

    // Find a group session and update the record as Unacceptable Absence
    await loginAsCaseAdmin(page)
    await findGroupSession(
        page,
        testData.crn,
        testData.person,
        testData.project.projectName,
        data.teams.unpaidWorkTestTeam.provider,
        data.teams.unpaidWorkTestTeam.name
    )
    await recordUnacceptableAbsenceOutcome(page)

    // Log in to Delius to confirm the record has been updated correctly
    await deliusLogin(page)
    await navigateToUnpaidWork(page, testData.crn)
    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await expect(page.locator('#appointmentsTable')).toContainText(/Unacceptable Absence/)
})

test('Find individual & group placements with a host partner and update record as Attendance Complied', async ({
    page,
}) => {
    // Find individual & group placements with a host partner and update the record as Attendance Complied
    await loginAsCaseAdmin(page)
    const teamName = 'CPB Manual Test Team'
    const crn = await findAnIndividualPlacement(page, data.teams.unpaidWorkTestTeam.provider, teamName)
    await recordAttendanceCompliedOutcome(page)

    // Log in to Delius to confirm the record has been updated correctly
    await deliusLogin(page)
    await navigateToUnpaidWork(page, crn)
    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await expect(page.locator('#appointmentsTable')).toContainText(/Attended - Complied/)
})

test('Adjust travel time hours', async ({ page }) => {
    // Adjust travel time hours for a case
    await loginAsCaseAdmin(page)
    const crn = await findAnAppointment(page, data.teams.unpaidWorkTestTeam.provider)

    const hours = '1'
    const minutes = '30'
    await adjustTravelTime(page, hours, minutes)

    // Log in to Delius to confirm the travel time adjustment has been updated correctly
    await deliusLogin(page)
    await navigateToUnpaidWork(page, crn)
    await page.getByRole('button', { name: 'Adjustment' }).click()
    await expect(page.locator('#currentAdjustmentsTable')).toContainText(RegExp(`-${hours}:${minutes}`, 'i'))
})

const createOffenderAndUpwProject = async (page: Page) => {
    await deliusLogin(page)
    const project = await createUpwProject(page, {
        providerName: data.teams.unpaidWorkTestTeam.provider,
        teamName: data.teams.unpaidWorkTestTeam.name,
    })

    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.unpaidWorkTestTeam.provider,
    })
    return { crn, project, person }
}

const createEventAndAllocateCaseToProject = async (page: Page, crn: string, projectName: string) => {
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.unpaidWorkTestTeam } })

    await createRequirementForEvent(page, {
        crn,
        requirement: data.requirements.unpaidWork,
        team: data.teams.unpaidWorkTestTeam,
    })

    await page.locator('a', { hasText: 'Personal Details' }).click()

    await allocateCurrentCaseToUpwProject(page, {
        crn: crn,
        providerName: data.teams.unpaidWorkTestTeam.provider,
        teamName: data.teams.unpaidWorkTestTeam.name,
        projectName: projectName,
    })
}

const navigateToUnpaidWork = async (page: Page, crn: string) => {
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
}
