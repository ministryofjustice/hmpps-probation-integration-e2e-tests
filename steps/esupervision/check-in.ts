import { expect, Page } from '@playwright/test'
import { Person } from '../delius/utils/person'
import { login as hmppsAuthLogin } from '../hmpps-auth/login'
import { DeliusDateFormatter } from '../delius/utils/date-time'
import { DateTime } from 'luxon'

export async function registerCase(page: Page, person: Person, crn: string) {
    await hmppsAuthLogin(page)
    await page.goto(process.env.ESUPERVISION_URL)
    await page.getByRole('button', { name: 'Add person' }).click()

    await enterPersonalDetails(page, person)
    await page.getByRole('textbox', { name: /CRN/ }).fill(crn)
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('link', { name: 'Upload photo instead' }).click()
    await page.locator('#photoUpload-input').setInputFiles('files/mock-person-photo.png')
    await page.getByRole('button', { name: 'Upload photo' }).click()
    await page.getByRole('link', { name: 'Yes, continue' }).click()

    await page.getByRole('radio', { name: 'Email' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page
        .locator('#email')
        .fill(`simulate-delivered+${person.firstName}${person.lastName}@notifications.service.gov.uk`)
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.locator('#startDate').fill(DeliusDateFormatter(new Date()))
    await page.getByRole('radio', { name: 'Every 8 weeks' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('button', { name: 'Confirm and add person' }).click()

    await page.getByRole('link', { name: 'Awaiting check in' }).click()
    const cell = page.getByRole('cell', { name: person.firstName + ' ' + person.lastName, exact: true })
    return await page.getByRole('row').filter({ has: cell }).getAttribute('data-checkin-uuid')
}

export async function createCheckin(page: Page, uuid: string, person: Person) {
    await page.goto(`${process.env.ESUPERVISION_URL}/submission/${uuid}`)
    await page.getByRole('button', { name: 'Start now' }).click()
    await enterPersonalDetails(page, person)
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('radio', { name: 'Very well' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('checkbox', { name: 'No, I do not need help' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('radio', { name: 'No' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Start recording' }).click()
    await page.getByRole('button', { name: 'Submit video anyway' }).click()

    await page.getByRole('checkbox', { name: /I confirm/ }).check()
    await page.getByRole('button', { name: 'Complete check in' }).click()
    await expect(page.locator('h1')).toContainText('Check in completed')
}

async function enterPersonalDetails(page: Page, person: Person) {
    await page.getByRole('textbox', { name: 'First name' }).fill(person.firstName)
    await page.getByRole('textbox', { name: 'Last name' }).fill(person.lastName)
    const dob = DateTime.fromJSDate(person.dob)
    await page.getByRole('textbox', { name: 'Day' }).fill(dob.day.toString())
    await page.getByRole('textbox', { name: 'Month' }).fill(dob.month.toString())
    await page.getByRole('textbox', { name: 'Year' }).fill(dob.year.toString())
}

export async function reviewCheckin(page: Page, person: Person) {
    await page.goto(process.env.ESUPERVISION_URL)
    await page
        .getByRole('row')
        .filter({ has: page.getByRole('cell', { name: person.firstName + ' ' + person.lastName, exact: true }) })
        .getByRole('link', { name: /Review/ })
        .click()
    await page.getByRole('radio', { name: 'Yes' }).check()
    await page.getByRole('button', { name: 'Mark as reviewed' }).click()
}
