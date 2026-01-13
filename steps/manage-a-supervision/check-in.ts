import { expect, Page } from '@playwright/test'
import { Person } from '../delius/utils/person'
import { getWorkingDayForEsupervision, options, uiDateToIso } from '../delius/utils/date-time'
import { DateTime } from 'luxon'
import { login as managePeopleOnProbationLogin } from '../manage-a-supervision/login'
import { refreshUntil } from '../delius/utils/refresh'
import { qa } from '../common/common'
import { createOffenderCheckin } from '../api/esupervision/esupervision'
import { searchPersonInMPoP } from './application'

export async function registerCaseInMPoP(page: Page, person: Person, crn: string) {
    const uiDueDate = getWorkingDayForEsupervision(1)
    const apiDueDate = uiDateToIso(uiDueDate)

    const heading = page.locator(qa('pageHeading'))

    // Login and Search for CRN
    await managePeopleOnProbationLogin(page)
    await searchPersonInMPoP(page, crn, heading)
    await expect(page.locator(qa('crn'))).toContainText(crn)
    await expect(page.locator(qa('name'))).toContainText(`${person.firstName} ${person.lastName}`)

    // Set up check-ins
    await page.getByRole('link', { name: 'Appointments', exact: true }).click()
    await page.getByRole('link', { name: 'Set up online check ins' }).click()
    await expect(heading).toContainText('How you can use online check ins')
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(heading).toContainText(/Set up\s+online check ins/i)
    await page.locator('.moj-js-datepicker-input').fill(uiDueDate)
    await page.getByRole('radio', { name: 'Every 2 weeks' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(heading).toContainText(/Contact preferences/i)
    await page.getByRole('button', { name: /change\s+email\s+address/i }).click()
    await expect(heading).toContainText(new RegExp(`Edit contact details for ${person.firstName}`, 'i'))
    const email = `${person.lastName}@service.gov.uk`
    await page.getByRole('textbox', { name: /Email address/i }).fill(email)
    await page.getByRole('button', { name: /Save changes/i }).click()
    await expect(page.locator('.moj-banner__message')).toContainText('Contact details saved')
    await page.getByRole('radio', { name: 'Email' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Photo journey
    await expect(heading).toContainText(new RegExp(`Take a photo of ${person.firstName}`, 'i'))
    await page.getByRole('radio', { name: 'Upload a photo' }).check()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(heading).toContainText(new RegExp(`Upload a photo of ${person.firstName}`, 'i'))
    await page.locator('input[type="file"]').setInputFiles('files/mock-person-photo.png')
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(heading).toContainText('Does this photo meet the rules?')
    await page.getByRole('link', { name: /Yes,\s*continue/i }).click()

    // Check answers + confirm
    await expect(heading).toContainText(/Check your answers before adding/i)
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Confirmation
    await expect(page.locator('.govuk-panel--confirmation')).toContainText('Online check ins added')
    return await createOffenderCheckin(crn, apiDueDate)
}

export async function createCheckin(page: Page, uuid: string, person: Person) {
    await page.goto(`${process.env.PROBATION_CHECK_IN_URL}/${uuid}`)

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
    await page.getByRole('button', { name: /Submit video anyway/ }).click()

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

export async function reviewCheckinInMPoP(page: Page, crn: string) {
    const heading = page.locator(qa('pageHeading'))
    await page.goto(process.env.MANAGE_PEOPLE_ON_PROBATION_URL)
    await searchPersonInMPoP(page, crn, heading)
    await page.getByRole('link', { name: 'Contacts', exact: true }).click()
    await expect(heading).toContainText('Contacts')
    await refreshUntil(
        page,
        async () => {
            await expect(page.getByRole('link', { name: 'Online probation check in' })).toBeVisible()
        },
        options
    )
    await page.getByRole('link', { name: 'Online probation check in', exact: true }).click()
    await expect(heading).toContainText('Online check in submitted')
    await page.getByRole('radio', { name: 'Yes' }).check()
    await page.getByRole('button', { name: 'Confirm and review responses' }).click()
    await expect(heading).toContainText('Online check in submitted')
    await page.getByRole('button', { name: 'Confirm review' }).click()
    await expect(page.locator(qa('descriptionValue'))).toContainText('Online check in completed')
    const checkinCard = page.locator('section.app-summary-card', {
        has: page.getByRole('link', { name: /online probation check in/i }),
    })
    await refreshUntil(
        page,
        async () => {
            await expect(checkinCard).toBeVisible()
            await expect(checkinCard).toContainText(/Checkin status:\s*Reviewed/i)
        },
        options
    )
}
