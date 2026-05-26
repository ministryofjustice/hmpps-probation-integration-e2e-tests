import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { Person } from '../delius/utils/person'
import { selectOption } from '../delius/utils/inputs'
import { DateTime } from 'luxon'

export async function recordAttendanceCompliedOutcome(page: Page, startTime?: string, endTime?: string) {
    // Log attendance
    await page.getByText('Attended - Complied').click()
    await page.locator('#notes').fill(faker.lorem.sentence())
    await page.getByRole('radio', { name: 'No, they are not sensitive' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Log start and end time
    if (startTime) {
        await page.locator('#startTime').fill(startTime)
    }

    if (endTime) {
        await page.locator('#endTime').fill(endTime)
    }
    // Log penalty hours
    await page.locator('#penaltyTimeHours').fill('1')
    await page.locator('#penaltyTimeMinutes').fill('0')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Log compliance
    await page.locator('input[name="hiVis"][value="yes"]').click()
    await page.locator('input[name="workedIntensively"][value="yes"]').click()
    await page.locator('input[name="workQuality"][value="EXCELLENT"]').click()
    await page.locator('input[name="behaviour"][value="GOOD"]').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Confirm details
    await page.getByRole('heading', { name: 'Confirm details' }).isVisible()
    await page.locator('input[name="alertPractitioner"][value="no"]').click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible()
    await expect(page.locator('.govuk-notification-banner__content h3')).toContainText(/Attendance recorded/)
    await page.getByRole('link', { name: 'Sign out' }).click()
}

export async function recordUnacceptableAbsenceOutcome(page: Page) {
    await page.getByText('Unacceptable Absence').click()
    await page.locator('#notes').fill(faker.lorem.sentence())
    await page.getByRole('radio', { name: 'No, they are not sensitive' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('heading', { name: 'Confirm details' }).isVisible()
    await expect(page.locator('.moj-alert__content')).toContainText(
        /This outcome will be shared with the practitioner as it requires enforcement action./
    )

    // Confirm details
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible()
    await expect(page.locator('.govuk-notification-banner__content h3')).toContainText(/Attendance recorded/)
    await page.getByRole('link', { name: 'Sign out' }).click()
}

export async function adjustTravelTime(page: Page, hours: string, minutes: string) {
    const today = DateTime.now()
    await page.locator('#date-day').fill(today.day.toString())
    await page.locator('#date-month').fill(today.month.toString())
    await page.locator('#date-year').fill(today.year.toString())
    await page.locator('#hours').fill(hours)
    await page.locator('#minutes').fill(minutes)
    await page.getByRole('button', { name: 'Credit travel time' }).click()

    await expect(page.locator('#success-title-1')).toContainText(/Success/)
    const hoursString = hours === '1' ? 'hour' : 'hours'
    const minutesString = hours === '1' ? 'minute' : 'minutes'
    await expect(page.locator('.govuk-notification-banner__content h3')).toContainText(
        RegExp(` has been adjusted for ${hours} ${hoursString} ${minutes} ${minutesString} of travel time.`, 'i')
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
    const today = DateTime.now()
    const supervisor = 'Unallocated Unallocated'
    await page.getByRole('link', { name: 'Record group session' }).click()
    await selectOption(page, '#provider', provider)
    await selectOption(page, '#team', teamName)
    await page.locator('#startDate-day').fill(today.day.toString())
    await page.locator('#startDate-month').fill(today.month.toString())
    await page.locator('#startDate-year').fill(today.year.toString())
    await page.locator('#endDate-day').fill(today.day.toString())
    await page.locator('#endDate-month').fill(today.month.toString())
    await page.locator('#endDate-year').fill(today.year.toString())
    await page.getByRole('button', { name: 'Apply filters' }).click()

    await page.getByRole('link', { name: projectName }).click()
    await expect(page.locator('h1.govuk-heading-l')).toContainText(projectName)
    await page.getByRole('cell', { name: person.firstName + person.lastName }).isVisible()
    await page.getByRole('cell', { name: crn }).isVisible()
    await page.getByRole('link', { name: 'Update' }).first().click()
    await expect(page.locator('.govuk-caption-l')).toContainText(crn)

    await addSupervisorDetails(page, teamName, supervisor)
}

export async function findAnIndividualPlacement(page: Page, provider: string, teamName: string) {
    const supervisor = 'Unallocated Staff'
    await page.getByRole('link', { name: 'Record attendance with host' }).click()
    await selectOption(page, '#provider', provider)
    await selectOption(page, '#team', teamName)
    await page.getByRole('button', { name: 'Apply filters' }).click()

    await page.getByRole('link', { name: 'Heartline Research Northfield' }).click()
    await page.getByRole('link', { name: 'Update' }).first().click()
    const crn = await page.locator('.govuk-caption-l').textContent()
    await expect(page.locator('h2.govuk-heading-m')).toContainText('Appointment details')

    await addSupervisorDetails(page, teamName, supervisor)
    return crn
}

export async function findAnAppointment(page: Page, provider: string) {
    await page.getByRole('link', { name: 'Adjust travel time hours' }).click()
    await selectOption(page, '#provider', provider)
    await page.getByRole('button', { name: 'Apply filters' }).click()
    const crn = await page.locator('//tbody/tr[4]/td[2]').textContent()
    await page.getByRole('link', { name: 'Update' }).nth(3).click()
    return crn
}

export async function addSupervisorDetails(page: Page, teamName: string, supervisor: string) {
    await page.getByRole('button', { name: 'Update appointment' }).click()
    await expect(page.getByRole('heading', { name: 'Add supervisor details' })).toBeVisible()
    await selectOption(page, '#team', teamName)
    await page.getByRole('button', { name: 'Select team' }).click()
    await selectOption(page, '#supervisor', supervisor)
    await page.getByRole('button', { name: 'Continue' }).click()
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
