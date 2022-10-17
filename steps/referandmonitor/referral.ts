import { expect, Page } from '@playwright/test'

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
    await page.locator('input[name="completion-deadline-day"]').fill('11')
    await page.locator('input[name="completion-deadline-month"]').fill('10')
    await page.locator('input[name="completion-deadline-year"]').fill('2023')

    // Click text=Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/further-information/)

    // Click text=Save and continue
    await page.locator('text=Save and continue').click()
    await expect(page).toHaveURL(/referrals\/.*\/form/)

    await page.locator('text=Check your answers >> nth=1').click()
    await expect(page).toHaveURL(/referrals\/.*\/check-answers/)

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
