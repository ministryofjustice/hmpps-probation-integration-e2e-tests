import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const createSupplierAssessmentAppointment = async (page: Page, referralRef: string) => {
    // Navigate to list of referrals
    await page.locator('a', { hasText: 'My cases' }).click()
    await expect(page).toHaveURL(/service-provider\/dashboard\/my-cases/)

    // Find the correct referral using the Referral Reference
    await page.locator('tr', { hasText: referralRef }).locator('a', { hasText: 'View' }).click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/progress/)

    // Navigate to the SA appointment form
    await page.locator('a', { hasText: 'Schedule initial assessment' }).click()
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
    await page.locator('input[name="duration-minutes"]').fill('30')

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
