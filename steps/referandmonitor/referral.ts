import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'

export const referralProgress = async (page: Page, referralRef: string) => {
    // Navigate to list of referrals
    await page.locator('a', { hasText: 'My cases' }).click()
    await expect(page).toHaveURL(/service-provider\/dashboard\/my-cases/)

    // Find the correct referral using the Referral Reference
    await page.locator('tr', { hasText: referralRef }).locator('a', { hasText: 'View' }).click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/progress/)
}

export const makeReferral = async (page: Page, crn: string) => {
    // Navigate to list of available interventions
    await page.locator('text=Find interventions').click()
    await expect(page).toHaveURL(/probation-practitioner\/find/)

    await page.locator('[data-cy="find-interventions-button"]').click()
    await expect(page).toHaveURL(/find-interventions?/)

    // Find Intervention
    await page.locator('text=Accommodation Services - North West').click()
    await expect(page).toHaveURL(/find-interventions\/intervention\/.*/)

    // Navigate to Make a referral page
    await page.locator('text=Make a referral').click()
    await expect(page).toHaveURL(/intervention\/.*\/refer?/)

    // Submit CRN
    await page.locator('input[name="service-user-crn"]').fill(crn)
    await page.locator('text=Continue').click()
    await expect(page).toHaveURL(/\/referrals\/.*\/form/)

    // Navigate to personal details page
    await page.locator('text=Confirm their personal details').click()
    await expect(page).toHaveURL(/referrals\/.*\/service-user-details/)

    // Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/risk-information/)

    // Risk
    await page.locator('#edit-risk-confirmation-2').check()
    await page.locator('input[name="confirm-understood"]').check()

    // Save and continue
    await page.locator('button:has-text("Save and continue")').click()
    await expect(page).toHaveURL(/referrals\/.*\/needs-and-requirements/)

    // Submit needs
    await page.locator('#needs-interpreter-2').check()
    await page.locator('#has-additional-responsibilities-2').check()

    // Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/submit-current-location/)

    await page.locator('#current-location-2').check()
    await page.locator('text=Save and continue').click()
    // await expect(page).toHaveURL(/referrals\/.*\/form/)
    await expect(page).toHaveURL(/referrals\/.*\/confirm-probation-practitioner-details/)


    // Confirm probation practitioner details
    await page.locator('#confirm-details').check()
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/form/)

    // Confirm the relevant sentence
    await page.locator('text=Confirm the relevant sentence for the Accommodation referral').click()
    await expect(page).toHaveURL(/referrals\/.*\/relevant-sentence/)
    await page.locator('input[name="relevant-sentence-id"]').check()

    // Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/service-category\/.*\/desired-outcomes/)

    // Desired outcomes
    await page.locator('#desired-outcomes-ids-2').check()

    // Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/service-category\/.*\/complexity-level/)

    // Complexity level
    await page
        .locator(
            'text=Medium complexity Service user is at risk of homelessness/is homeless, or will b >> input[name="complexity-level-id"]'
        )
        .check()

    // Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/enforceable-days/)

    // Enforcable days
    await page.locator('input[name="maximum-enforceable-days"]').fill('10')

    // Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/completion-deadline/)

    // Completion deadline
    const futureDate = faker.date.future({ years: 2 })
    await page.locator('input[name="completion-deadline-day"]').fill(futureDate.getDate().toString())
    await page.locator('input[name="completion-deadline-month"]').fill((futureDate.getMonth() + 1).toString())
    await page.locator('input[name="completion-deadline-year"]').fill(futureDate.getFullYear().toString())

    // Click text=Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/further-information/)

    // Click text=Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/form/)

    //Check all referral information and submit referral
    await page.locator('[href="check-all-referral-information"]').click()
    await expect(page).toHaveURL(/referrals\/.*\/check-all-referral-information/)

    // Click text=Submit referral
    await page.locator('text=Submit referral').click()
    await expect(page).toHaveURL(/referrals\/.*\/confirmation/)

    // Return the referral reference
    return await page.locator('.govuk-panel__body >> strong').textContent()
}

export const assignReferral = async (page: Page, referralRef: string) => {
    // Navigate to list of available interventions
    await page.locator('text=Unassigned cases').click()
    await expect(page).toHaveURL(/service-provider\/dashboard\/unassigned-cases/)

    // Find the correct referral using the Referral Reference
    await page.locator('tr', { hasText: referralRef }).locator('a', { hasText: 'View' }).click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/details/)

    // Add the caseworker email address
    await page.fill('#email', process.env.REFERANDMONITOR_SUPPLIER_USERNAME!)

    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/assignment\/.*\/check/)

    await page.locator('text=Confirm assignment').click()
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/assignment\/confirmation/)

    await page.locator('text=Return to dashboard').click()
    await expect(page).toHaveURL(/service-provider\/dashboard\/unassigned-cases/)
}

export const cancelReferral = async (page: Page, referralRef: string) => {
    // Navigate to list of available interventions
    await page.locator('a', { hasText: 'Open cases' }).click()
    await expect(page).toHaveURL(/probation-practitioner\/dashboard\/open-cases/)

    await page.locator('tr', { hasText: referralRef }).locator('a', { hasText: 'View' }).click()
    await expect(page).toHaveURL(/probation-practitioner\/referrals\/.*\/progress/)

    await page.locator('a', { hasText: 'Cancel this referral' }).click()
    await expect(page).toHaveURL(/probation-practitioner\/referrals\/.*\/cancellation\/.*\/reason/)

    await page.locator('label', { hasText: "Probation practitioner's professional judgement" }).click()
    await page.locator('button.govuk-button').click()

    await page.locator('p', { hasText: 'Are you sure you want to cancel this referral?' })
    await page.locator('button.govuk-button').click()
    await expect(page.locator('h1.govuk-panel__title')).toContainText('This referral has been cancelled')
}
