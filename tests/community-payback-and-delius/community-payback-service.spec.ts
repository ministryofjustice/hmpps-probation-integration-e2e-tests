import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { data } from '../../test-data/test-data'
import { selectOption } from '../../steps/delius/utils/inputs'
import { createUpwProject } from '../../steps/delius/upw/create-upw-project'
import { allocateCurrentCaseToUpwProject } from '../../steps/delius/upw/allocate-current-case-to-upw-project'
import { caseAdminLogin } from '../../steps/community-payback/case-admin-login'
import {
    adjustTravelTime,
    findGroupSession,
    findPlacementsWithHostPartner,
    recordAttendanceCompliedOutcome,
} from '../../steps/community-payback/record-outcome'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'

test('Find a group session and update record as Attendance Complied', async ({ page }) => {
    // Given I create a new Offender in nDelius
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

    const event = await createCommunityEvent(page, { crn, allocation: { team: data.teams.unpaidWorkTestTeam } })

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
        projectName: project.projectName,
    })

    await page.pause()
    await caseAdminLogin(page)
    await findGroupSession(
        page,
        crn,
        person,
        project.projectName,
        data.teams.unpaidWorkTestTeam.provider,
        data.teams.unpaidWorkTestTeam.name
    )
    await recordAttendanceCompliedOutcome(page, crn)

    // Log in to Delius to confirm record has been updated correctly
    await deliusLogin(page)
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    // await page.locator('a', { hasText: 'Unpaid Work' }).click()
    await page.pause()
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await expect(page.locator('#appointmentsTable')).toContainText(/Attended - Complied/)
})

test('Find individual and group placements with a host partner and update record as Attendance Complied', async ({
    page,
}) => {
    await caseAdminLogin(page)
    const teamName = 'CPB Automated Test Team'
    const crn = await findPlacementsWithHostPartner(page, data.teams.unpaidWorkTestTeam.provider, teamName)
    await recordAttendanceCompliedOutcome(page, crn)

    // Log in to Delius to confirm record has been updated correctly
    await deliusLogin(page)
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.pause()
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Worksheet summary' }).click()
    await expect(page.locator('#appointmentsTable')).toContainText(/Attended - Complied/)
})

test('Adjust travel time hours', async ({ page }) => {
    await caseAdminLogin(page)
    await page.getByRole('link', { name: 'Adjust travel time hours' }).click()
    await selectOption(page, '#provider', 'East of England')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    const crn = await page.locator('//tbody/tr[1]/td[2]').textContent()
    await page.getByRole('link', { name: 'Update' }).first().click() // person update button

    const hours = '2'
    const minutes = '30'
    await adjustTravelTime(page, hours, minutes)

    // Log in to Delius to confirm the travel time adjustment has been updated correctly
    await deliusLogin(page)
    await findOffenderByCRN(page, crn)
    await page.pause()
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'view', exact: true }).click()
    await page.click('#navigation-include\\:linkNavigation3UnpaidWork')
    await page.getByRole('button', { name: 'Adjustment' }).click()
    await expect(page.locator('#currentAdjustmentsTable')).toContainText(RegExp(`-${hours}:${minutes}`, 'i'))
})
