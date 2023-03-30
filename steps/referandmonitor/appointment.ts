import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { referralProgress } from './referral.js'

export const createSupplierAssessmentAppointment = async (page: Page, referralRef: string) => {
    await referralProgress(page, referralRef)

    // Navigate to the SA appointment form
    await page.locator('a.govuk-link', { hasText: 'Schedule' }).click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/supplier-assessment\/schedule\/.*\/details/)

    // Appointment date and time
    const appointmentDate = faker.date.soon(10)
    await page.locator('input[name="date-day"]').fill(appointmentDate.getDate().toString())
    await page.locator('input[name="date-month"]').fill((appointmentDate.getMonth() + 1).toString())
    await page.locator('input[name="date-year"]').fill(appointmentDate.getFullYear().toString())
    await page.locator('input[name="time-hour"]').fill('10')
    await page.locator('input[name="time-minute"]').fill('0')
    await page.locator('select[name="time-part-of-day"]').selectOption('am')

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
}

interface SessionDetail {
    number: number
    attended: boolean
    notifyOm: boolean
}

export const editSessions = async (
    page: Page,
    referralRef: string,
    sessionDetails: SessionDetail[] = [{ number: 1, attended: true, notifyOm: false }]
) => {
    await referralProgress(page, referralRef)
    const now = new Date()
    const sessionDate = new Date(new Date().setHours(now.getHours() - sessionDetails.length))
    for (const detail of sessionDetails) {
        await editSession(
            page,
            referralRef,
            new Date(sessionDate.setHours(sessionDate.getHours() + detail.number - 1)),
            detail
        )
    }
}

const editSession = async (
    page: Page,
    referralRef: string,
    sessionDate: Date,
    detail: SessionDetail
) => {
    await page
        .locator('tr', { hasText: `Session ${detail.number}` })
        .locator('a.govuk-link', { hasText: 'Edit session details' })
        .click()

    await page.locator('input[name="date-day"]').fill(sessionDate.getDate().toString())
    await page.locator('input[name="date-month"]').fill((sessionDate.getMonth() + 1).toString())
    await page.locator('input[name="date-year"]').fill(sessionDate.getFullYear().toString())
    const hours = sessionDate.getHours() > 12 ? sessionDate.getHours() - 12 : sessionDate.getHours()
    await page.locator('input[name="time-hour"]').fill(hours.toString())
    await page.locator('input[name="time-minute"]').fill(sessionDate.getMinutes().toString())
    const ampm = sessionDate.getHours() > 12 ? 'pm' : 'am'
    await page.locator('select[name="time-part-of-day"]').selectOption(ampm)

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

        // add behaviour
        await page.fill('#behaviour-description', 'A description of the behaviour')
        // notify OM
        await page.click(`input[value=${detail.notifyOm ? "yes" : "no"}]`)
        // save
        await page.click('button.govuk-button')
    }

    await page.waitForURL(
        /service-provider\/action-plan\/.*\/appointment\/.*\/post-session-feedback\/edit\/.*\/check-your-answers/
    )

    // confirm feedback
    await page.click('button.govuk-button')
    await page.waitForURL(/service-provider\/action-plan\/.*\/appointment\/.*\/post-session-feedback\/confirmation/)

    // return to progress screen
    await page.click('a.govuk-button')
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/progress/)
}
