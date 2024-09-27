import { expect, type Page } from '@playwright/test'
import { referralProgress } from './referral'
import { DateTime } from 'luxon'
import { get12Hour, getTimeOfDay } from '../delius/utils/date-time'
import { refreshUntil } from '../delius/utils/refresh'
import { fillAndSaveIfTextBoxIsAvailable } from '../delius/contact/find-contacts'

export const createSupplierAssessmentAppointment = async (
    page: Page,
    referralRef: string,
    appointmentDate: DateTime = DateTime.now().minus({ minutes: 1 }),
    appointmentTime = appointmentDate,
    conflictingAppointment = false
) => {
    await referralProgress(page, referralRef)

    // Navigate to the SA appointment form
    await page.locator('[href$="progress"]', { hasText: 'Progress' }).click()
    await page.locator('a.govuk-link', { hasText: 'Schedule' }).click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/details/)

    // Appointment date and time
    await page.locator('input[name="date-day"]').fill(appointmentDate.day.toString())
    await page.locator('input[name="date-month"]').fill(appointmentDate.month.toString())
    await page.locator('input[name="date-year"]').fill(appointmentDate.year.toString())
    await page.locator('input[name="time-hour"]').fill(get12Hour(appointmentTime.toJSDate()).toString())
    await page.locator('input[name="time-minute"]').fill(appointmentTime.minute.toString())
    await page.locator('select[name="time-part-of-day"]').selectOption(getTimeOfDay(appointmentTime.toJSDate()))

    // Appointment duration
    await page.locator('input[name="duration-hours"]').fill('0')
    await page.locator('input[name="duration-minutes"]').fill('15')

    // Appointment type
    await page.locator('#meeting-method-phone-call').check()

    // Save and continue
    await page.locator('text=Save and continue').click()
    await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/check-answers/)
    await page.locator('button:has-text("Confirm")').click()

    if (conflictingAppointment) {
        await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/details/)
        return
    } else if (appointmentDate <= DateTime.now()) {
        await page.waitForURL(
            /service-provider\/referrals\/.*\/supplier-assessment\/post-assessment-feedback\/edit\/.*\/attendance/
        )
        await page.click('#didSessionHappenYesRadio')
        await page.click('button.govuk-button')
        await page.click('#wasLateNoRadio')
        await page.fill('#session-summary', 'Summary about the session')
        await page.fill('#session-response', 'Response to the session')
        await page.click('#noNotifyPPCheckbox')
        await page.click('button.govuk-button')
        await page.waitForURL(
            /service-provider\/referrals\/.*\/supplier-assessment\/post-assessment-feedback\/edit\/.*\/check-your-answers/
        )
        await page.click('button.govuk-button')
    } else {
        await page.waitForURL(/service-provider\/referrals\/.*\/supplier-assessment\/scheduled-confirmation/)
        await page.locator('text=Return to progress').click()
        await page.waitForURL(/service-provider\/referrals\/.*\/progress/)
    }
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
        .locator('a.govuk-link', { hasText: 'Add session details' })
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
        await page.waitForURL(
            /service-provider\/action-plan\/.*\/appointment\/.*\/post-session-feedback\/edit\/.*\/behaviour/
        )

        // What did you do in the session?
        await page.fill('#session-summary', 'A description of the behaviour')

        // How did person respond to the session?
        await page.fill('#session-response', 'A description of the response from the person')

        // Did anything concern you about the person
        await page.locator('#notify-probation-practitioner-2').check()
        await page.click('button.govuk-button')
    }

    await fillAndSaveIfTextBoxIsAvailable(
        page,
        '#attendance-failure-information',
        'Additional information of the person not attending the appointment',
        'button.govuk-button'
    )
    await page.waitForURL(
        /service-provider\/action-plan\/.*\/appointment\/.*\/post-session-feedback\/edit\/.*\/check-your-answers/
    )

    // confirm feedback
    await page.click('button.govuk-button')
    await page.waitForURL(/\/service-provider\/referrals\/[^/]+\/progress\?showFeedbackBanner=true&notify/)
}

export async function addAppointmentFeedback(page: Page, attended: boolean) {
    const addFeedbackLink = page.getByRole('link', { name: 'Mark attendance and add feedback' })
    await refreshUntil(page, () => expect(addFeedbackLink).toBeVisible())
    await addFeedbackLink.click()
    await page.locator(attended ? '#didSessionHappenYesRadio' : '#didSessionHappenNoRadio').check()
    if (!attended) {
        await page.locator('#attendedNoRadio').check()
        await page.getByRole('button', { name: 'Save and continue' }).click()
        await page
            .locator('#no-attendance-information')
            .fill('Additional information of the person not attending the appointment')
        await page.locator('#noNotifyPPRadio').check()
    } else {
        await page.getByRole('button', { name: 'Save and continue' }).click()
        await page.locator('#wasLateNoRadio').check()
        await page.locator('#session-summary').fill('Test session summary of what I did in the appointment')
        await page.locator('#session-response').fill('Person seemed quite engaged and responded quite well')
        await page.locator('#noNotifyPPCheckbox').check()
    }
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: /Confirm and send/ }).click()
    await page.waitForURL(
        /\/service-provider\/referrals\/[^/]+\/progress\?showFeedbackBanner=true&notifyPP=null&dna=true/
    )
    await expect(page.locator('#supplier-assessment-status')).toContainText(attended ? 'attended' : 'did not attend')
}
