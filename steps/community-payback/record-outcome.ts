import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { Person } from '../delius/utils/person'
import { selectOption } from '../delius/utils/inputs'
import { DateTime } from 'luxon'

export async function recordAttendanceCompliedOutcome(page: Page, startTime?: string, endTime?: string) {
    // Log attendance
    await page.getByText('Attended – complied').click()
    await page.locator('#notes').fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Continue' }).click()

    // Log start and end time
    if (startTime) {
        await page.locator('#startTime').fill(startTime)
    }

    if (endTime) {
        await page.locator('#endTime').fill(endTime)
    }
    await page.getByRole('button', { name: 'Continue' }).click()

    // Log compliance
    await page.locator('input[name="workQuality"][value="EXCELLENT"]').click()
    await page.locator('input[name="behaviour"][value="GOOD"]').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm details
    await page.getByRole('heading', { name: 'Confirm details' }).isVisible()
    await page.locator('input[name="alertPractitioner"][value="no"]').click()
    await confirmDetails(page)
}

export async function recordUnacceptableAbsenceOutcome(page: Page) {
    await page.getByText('Unacceptable Absence').click()
    await page.locator('#notes').fill(faker.lorem.sentence())
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('heading', { name: 'Confirm details' }).isVisible()
    await expect(page.locator('.moj-alert__content')).toContainText(
        /This outcome will be shared with the practitioner as it requires enforcement action./
    )

    // Confirm details
    await confirmDetails(page)
}

export async function adjustTravelTime(page: Page, hours: number, minutes: number) {
    const today = DateTime.now()
    await page.locator('#date-day').fill(today.day.toString())
    await page.locator('#date-month').fill(today.month.toString())
    await page.locator('#date-year').fill(today.year.toString())
    await page.locator('#hours').fill(hours.toString())
    await page.locator('#minutes').fill(minutes.toString())
    await page.getByRole('button', { name: 'Credit travel time' }).click()

    await expect(page.locator('#success-title-1')).toContainText(/Success/)
    let hoursString = ''
    let minutesString = ''
    if (hours > 0) {
        hoursString = hours === 1 ? ' 1 hour' : ` ${hours} hours`
    }
    if (minutes > 0) {
        minutesString = minutes === 1 ? ' 1 minute' : ` ${minutes} minutes`
    }
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(
        RegExp(` has been adjusted for${hoursString}${minutesString} of travel time.`, 'i')
    )
    await page.getByRole('link', { name: 'Sign out' }).click()
}

export async function findGroupSession(
    page: Page,
    crn: string,
    person: Person,
    projectName: string,
    provider: string,
    teamName: string
) {
    const today = DateTime.now().setLocale('en-gb').toLocaleString(DateTime.DATE_SHORT)

    const supervisor = 'Unallocated Unallocated'
    await page.getByRole('link', { name: 'Record attendance at a group' }).click()
    await selectOption(page, '#provider', provider)
    await selectOption(page, '#team', teamName)
    await page.locator('#date').fill(today.toString())
    await page.getByRole('button', { name: 'Apply filters' }).click()

    await page.getByRole('link', { name: projectName }).click()
    await expect(page.locator('h1.govuk-heading-l')).toContainText(projectName)
    await page.getByRole('cell', { name: person.firstName + person.lastName }).isVisible()
    await page.getByRole('cell', { name: crn }).isVisible()
    await page.getByRole('link', { name: 'View' }).first().click()
    await expect(page.locator('.govuk-caption-l')).toContainText(crn)

    await addSupervisorDetails(page, teamName, supervisor, projectName)
}

export async function findAnIndividualPlacement(page: Page, provider: string, teamName: string) {
    const supervisor = 'Unallocated Staff'
    const projectName = 'Heartline Research Northfield'
    await page.getByRole('link', { name: 'Record attendance at a host' }).click()
    await selectOption(page, '#provider', provider)
    await selectOption(page, '#team', teamName)
    await page.getByRole('button', { name: 'Apply filters' }).click()

    await page.getByRole('link', { name: projectName }).click()
    await page.getByRole('link', { name: 'View' }).first().click()
    const crn = await page.locator('.govuk-caption-l').textContent()
    await expect(page.locator('h2.govuk-heading-m')).toContainText('Appointment details')

    await addSupervisorDetails(page, teamName, supervisor, projectName)
    return crn
}

export async function findAnAppointment(page: Page, provider: string) {
    await page.getByRole('link', { name: 'Record travel time' }).click()
    await selectOption(page, '#provider', provider)
    await page.getByRole('button', { name: 'Apply filters' }).click()
    const crn = await page.locator('//tbody/tr[4]/td[2]').textContent()
    await page.getByRole('link', { name: 'Update' }).nth(3).click()
    return crn
}

export async function addSupervisorDetails(page: Page, teamName: string, supervisor: string, projectName: string) {
    await page.getByRole('button', { name: 'Update appointment' }).click()
    await expect(page.getByRole('heading', { name: 'Add supervisor details' })).toBeVisible()
    await selectOption(page, '#team', teamName)
    await page.getByRole('button', { name: 'Select team' }).click()
    await selectOption(page, '#supervisor', supervisor)
    await page.getByRole('button', { name: 'Continue' }).click()
    await selectOption(page, '#project', projectName)
    await page.getByRole('button', { name: 'Continue' }).click()
}

export async function confirmDetails(page: Page) {
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible()
    await expect(page.locator('.govuk-notification-banner__content')).toContainText(/Attendance recorded/)
    await page.getByRole('link', { name: 'Sign out' }).click()
}

export async function recordSessionAttendance(page: Page, startTime: string, endTime: string) {
    await expect(page).toHaveTitle(/Record group session attendance/)
    await page.getByRole('button', { name: 'View details' }).first().click()
    await page.getByRole('heading', { name: 'Session details' }).isVisible()
    await page.getByRole('heading', { name: 'Automated UI Tests' }).isVisible()
    await page.getByRole('link', { name: 'View and update' }).click()

    const crn = await page.locator('.govuk-caption-l').textContent()
    await page.getByRole('button', { name: 'Arrived', exact: true }).click()

    await page.locator('#time').fill(startTime)
    await page.getByRole('button', { name: 'Confirm and continue' }).click()

    await page.locator('input[name="ableToWork"][value="yes"]').click()
    await page.getByRole('button', { name: 'Confirm and continue' }).click()

    await page.locator('#time').fill(endTime)
    await page.getByRole('button', { name: 'Confirm and continue' }).click()

    return crn
}
