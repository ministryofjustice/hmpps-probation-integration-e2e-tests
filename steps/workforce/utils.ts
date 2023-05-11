import { Allocation } from '../../test-data/test-data.js'
import { subDays, isBefore } from 'date-fns'
import { parse } from 'date-fns'
import { expect, Page } from '@playwright/test'
import { doUntil, refreshUntil } from '../delius/utils/refresh.js'
import { selectTeam } from './allocations.js'
import { login as workforceLogin } from '../../steps/workforce/login.js'

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]
export const WorkforceDateFormat = (date: Date) => {
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
}

export const allocateUnallocatedCasesWithinDateRange = async (
    page: Page,
    maxIterations: number,
    rangeDays: number,
    allocation: Allocation
) => {
    const today = new Date()
    const fiveDaysAgo = subDays(today, rangeDays)

    for (let i = 1; i <= maxIterations; i++) {
        try {
            console.log(`Running iteration ${i}`)

            // Login to Manage Workforce and navigate @Unallocated Cases@
            await workforceLogin(page)
            await page.getByRole('button', { name: 'View unallocated cases' }).click()
            await refreshUntil(page, () => expect(page).toHaveTitle(/.*Unallocated cases.*/))

            // Sort the Sentence Date Column to get the older cases first
            await page.getByRole('button', { name: '▼ Sentence date ▲' }).click()

            const dateText = await page.$eval(
                '#main-content div.moj-scrollable-pane.govuk-\\!-margin-bottom-9 table tbody tr:first-child td:nth-child(3)',
                el => el.textContent.trim()
            )
            const date = parse(dateText, 'dd MMMM yyyy', new Date())

            if (isBefore(fiveDaysAgo, date)) {
                console.log(`Date ${date} is 5 days or less before today's date. Stopping loop.`)
                break
            }

            const crn = await page
                .locator('div > table > tbody > tr:nth-child(1) > td:nth-child(1) > span')
                .textContent()
            console.log(`Allocating Case ${i} for ${crn} with Sentence DATE ${date}`)
            await selectTeam(page, allocation.team)
            await page.click('div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a')
            await page.locator('a', { hasText: 'Continue' }).click()
            await refreshUntil(page, () => expect(page).toHaveTitle(/.*Choose practitioner.*/))

            // Allocate to team/staff
            await page
                // .locator('tr', { hasText: `${allocation.staff.firstName} ${allocation.staff.lastName}` })
                .locator('tr', { hasText: `Isaiah Lakanu` })


                .getByRole('radio')
                .check()
            await page.locator('button', { hasText: 'Continue' }).click()

            // Explain the reason for allocation to this Practitioner
            await expect(page).toHaveTitle(/.*Explain your decision | Manage a workforce.*/)
            await page.fill(
                '#evidenceText',
                `${allocation.staff.firstName} ${allocation.staff.lastName} is allocated on case with ${crn} has the necessary specialized knowledge, skills, experience, and training to manage it.`
            )
            await page.click('#isSensitive')
            await page.locator('button', { hasText: 'Continue' }).click()

            // Confirm allocation
            await expect(page).toHaveTitle(/.*Choose practitioner | Manage a workforce.*/)
            await page.locator('a', { hasText: 'Continue' }).click()

            // Review and submit allocation
            await expect(page).toHaveTitle(/.*Review allocation instructions.*/)
            await page.fill('#instructions', `Allocation for ${crn} completed by hmpps-end-to-end-tests`)
            await page.locator('button', { hasText: 'Allocate Case' }).click()
            await refreshUntil(page, () => expect(page).toHaveTitle(/.*Case allocated | Manage a workforce.*/))

            await doUntil(
                () => page.locator('a', { hasText: 'Sign out' }).click(),
                () => expect(page).toHaveTitle(/.*HMPPS Digital Services - Sign in.*/)
            )
        } catch (error) {
            console.error(`Error occurred in iteration ${i}: ${error}`)
        } finally {
            // Always clear cookies and storage to ensure a fresh start for the next iteration
            await page.context().clearCookies()
        }
    }
}
