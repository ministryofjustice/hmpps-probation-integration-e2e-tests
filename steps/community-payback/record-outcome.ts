import { expect, Locator, Page } from '@playwright/test'
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
    await page.locator('input[name="alertPractitioner"][value="no"]').click()

    // Confirm details
    await confirmDetails(page)
}

export async function adjustTravelTime(page: Page, hours: number, minutes: number) {
    if (hours === 1) {
        await page.locator('#time').click()
    } else {
        await page.locator('#time-2').click()
    }
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

    const projectLink = page.getByRole('link', { name: projectName, exact: true })
    await findOnPaginatedResults(page, projectLink, `Session for ${projectName}`)
    await projectLink.click()
    await expect(page.locator('h1.govuk-heading-l')).toContainText(projectName)
    const row = page.getByRole('row').filter({ hasText: crn })
    await expect(row).toBeVisible()
    await row.getByRole('link', { name: 'View' }).click()
    await expect(page.locator('.govuk-caption-l')).toContainText(crn)

    await addSupervisorDetails(page, teamName, supervisor)
}

export async function findAnIndividualPlacement(
    page: Page,
    crn: string,
    person: Person,
    provider: string,
    teamName: string
) {
    await page.getByRole('link', { name: 'Record attendance at a host' }).click()
    await selectOption(page, '#provider', provider)
    await selectOption(page, '#team', teamName)
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await page.getByRole('link', { name: 'Missing outcomes' }).click()
    await page.getByRole('link', { name: 'Missing outcomes' }).click()
    await page.locator('//td[@class="govuk-table__cell"]/a').first().click()
    // Add appointment
    await page.getByRole('link', { name: 'Add an appointment' }).click()
    // Search for person
    await page.locator('#search').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()
    // Select generated person
    await page
        .getByRole('link', {
            name: `${person.lastName}, ${person.firstName}`,
        })
        .click()
    // Enter today's date
    const today = new Date().toLocaleDateString('en-GB')
    await page.locator('#date').fill(today)
    await page.getByRole('button', { name: 'Continue' }).click()
    // Select team
    await page.locator('#team').selectOption('N56CPM')
    await page.getByRole('button', { name: 'Select team' }).click()
    // Select supervisor
    await page.locator('#supervisor').selectOption('N56A310')
    await page.getByRole('button', { name: 'Continue' }).click()
    // Continue through requirement page
    await page.getByRole('button', { name: 'Continue' }).click()
    // Attendance outcome
    await page.locator('#attendanceOutcome').check()
    await page.getByRole('button', { name: 'Continue' }).click()
    // Appointment times
    const now = DateTime.now()
    await page.locator('#startTime').fill(now.minus({ hours: 1 }).toFormat('HH:mm'))
    await page.locator('#endTime').fill(now.toFormat('HH:mm'))
    await page.getByRole('button', { name: 'Continue' }).click()
    // Work quality
    await page.locator('#workQuality').check()
    // Behaviour
    await page.locator('#behaviour').check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByText('Attendance recorded')).toBeVisible()
    await page.getByRole('link', { name: 'Past appointments' }).click()
    const row = page.getByRole('row').filter({ hasText: crn })
    await findOnPaginatedResults(page, row, `Appointment for ${crn}`)
    await expect(row).toContainText('Attended – complied')
    return crn
}

async function findOnPaginatedResults(page: Page, target: Locator, description: string, maxPages = 20) {
    const results = page.getByText(/Showing \d+ to \d+ of \d+ total results/)
    const nextPage = page.getByRole('link', { name: 'Next page' })

    await expect(results).toBeVisible()
    for (let pageNumber = 1; !(await target.isVisible()); pageNumber++) {
        expect(pageNumber, `${description} not found within ${maxPages} pages`).toBeLessThan(maxPages)
        await expect(nextPage, `${description} not found in results`).toBeVisible()
        const previousResults = await results.textContent()
        await nextPage.click()
        await expect(results).not.toHaveText(previousResults)
    }
}

export async function findAnAppointment(page: Page, provider: string) {
    await page.getByRole('link', { name: 'Record travel time' }).click()
    await selectOption(page, '#provider', provider)
    await page.getByRole('button', { name: 'Apply filters' }).click()
    // Sort by date to find the most recent appointments
    const dateSort = page
        .getByRole('columnheader')
        .filter({ has: page.getByRole('link', { name: 'Date', exact: true }) })
        .getByRole('link')
    await dateSort.click()
    await dateSort.click()
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
