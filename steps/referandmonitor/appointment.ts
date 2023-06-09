import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { referralProgress } from './referral.js'
import { addDays, parse } from 'date-fns'
import { get12Hour, getTimeOfDay, Tomorrow } from '../delius/utils/date-time.js'
import { refreshUntil } from '../delius/utils/refresh.js'

export const createSupplierAssessmentAppointment = async (
    page: Page,
    referralRef: string,
    appointmentDate: Date = addDays(faker.date.soon({ days: 10, refDate: Tomorrow }), 1),
    appointmentTime = parse('10:00', 'HH:mm', appointmentDate)
) => {
    await referralProgress(page, referralRef)

    // Navigate to the SA appointment form
    await page.locator('a.govuk-link', { hasText: 'Schedule' }).click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/details/)

    // Appointment date and time
    await page.locator('input[name="date-day"]').fill(appointmentDate.getDate().toString())
    await page.locator('input[name="date-month"]').fill((appointmentDate.getMonth() + 1).toString())
    await page.locator('input[name="date-year"]').fill(appointmentDate.getFullYear().toString())
    await page.locator('input[name="time-hour"]').fill(get12Hour(appointmentTime).toString())
    await page.locator('input[name="time-minute"]').fill(appointmentTime.getMinutes().toString())
    await page.locator('select[name="time-part-of-day"]').selectOption(getTimeOfDay(appointmentTime))

    // Appointment duration
    await page.locator('input[name="duration-hours"]').fill('0')
    await page.locator('input[name="duration-minutes"]').fill('15')

    // Appointment type
    await page.locator('#meeting-method-phone-call').check()

    // Save and continue
    await page.locator('text=Save and continue').click()
    await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/check-answers/)
    await page.locator('button:has-text("Confirm")').click()
    await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/scheduled-confirmation/)
    await page.locator('text=Return to progress').click()
    await page.waitForURL(/service-provider\/referrals\/.*\/progress/)

    // Return the appointment date and time
    return page.locator('[data-cy="supplier-assessment-table"] .govuk-table__cell:first-child').innerText()
}

interface SessionDetail {
    number: number
    attended?: boolean
    notifyOm?: boolean
    date: Date
}

export const editSessions = async (
    page: Page,
    referralRef: string,
    sessionDetails: SessionDetail[] = [{ number: 1, attended: true, notifyOm: false, date: new Date() }]
) => {
    await referralProgress(page, referralRef)
    for (const detail of sessionDetails) {
        await editSession(page, referralRef, detail)
    }
}

const editSession = async (page: Page, referralRef: string, detail: SessionDetail) => {
    await page
        .locator('tr', { hasText: `Session ${detail.number}` })
        .locator('a.govuk-link', { hasText: 'Edit session details' })
        .click()

    const sessionDate = detail.date
    await page.locator('input[name="date-day"]').fill(sessionDate.getDate().toString())
    await page.locator('input[name="date-month"]').fill((sessionDate.getMonth() + 1).toString())
    await page.locator('input[name="date-year"]').fill(sessionDate.getFullYear().toString())
    await page.locator('input[name="time-hour"]').fill(get12Hour(sessionDate).toString())
    await page.locator('input[name="time-minute"]').fill(sessionDate.getMinutes().toString())
    await page.locator('select[name="time-part-of-day"]').selectOption(getTimeOfDay(sessionDate))
    await page.locator('input[name="duration-hours"]').fill('0')
    await page.locator('input[name="duration-minutes"]').fill('15')

    // select session type
    await page.locator('input[value="ONE_TO_ONE"]').check()

    // select method
    await page.locator('input[value="PHONE_CALL"]').check()

    await page.click('button.govuk-button')
    await page.waitForURL(/service-provider\/action-plan\/.*\/sessions\/.*\/edit\/.*\/check-answers/)

    await page.click('button.govuk-button')
    await page.waitForURL(
        /service-provider\/action-plan\/.*\/appointment\/.*\/post-session-feedback\/edit\/.*\/attendance/
    )

    // add feedback
    await page.click(`input[value=${detail.attended ? 'yes' : 'no'}]`)
    await page.click('button.govuk-button')

    if (detail.attended) {
        await page.waitForURL(/service-provider\/action-plan\/.*\/appointment\/.*\/post-session-feedback\/edit\/.*\/behaviour/)
        // add behaviour
        await page.fill('#behaviour-description', 'A description of the behaviour')
        // notify OM
        await page.click(`input[value=${detail.notifyOm ? 'yes' : 'no'}]`)
        // save
        await page.click('button.govuk-button')
    }

    // confirm feedback
    await page.click('button.govuk-button')
    await page.waitForURL(/service-provider\/action-plan\/.*\/appointment\/.*\/post-session-feedback\/confirmation/)

    // return to progress screen
    await page.click('a.govuk-button')
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/progress/)
}

export async function addAppointmentFeedback(page: Page, attended: boolean) {
    const addFeedbackLink = page.getByRole('link', { name: 'Mark attendance and add feedback' })
    await refreshUntil(page, () => expect(addFeedbackLink).toBeVisible())
    await addFeedbackLink.click()
    await page.getByLabel(attended ? 'Yes' : 'No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page).toHaveTitle(/Submission confirmation/)
    await page.getByRole('link', { name: 'Return to progress' }).click()
    await expect(page.locator('#supplier-assessment-status')).toContainText(attended ? 'attended' : 'did not attend')
}
