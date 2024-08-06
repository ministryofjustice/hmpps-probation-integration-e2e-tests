import { expect, Page } from '@playwright/test'

export const createActionPlan = async (page: Page, numberOfSessions = 1) => {
    await page.locator('.button-link', { hasText: 'Create action plan' }).click()
    await page.waitForURL(/service-provider\/action-plan\/.*\/add-activity\/1/)

    await page.fill('#description', 'Adding the first activity')
    await page.click('#add-activity')
    await page.waitForURL(/service-provider\/action-plan\/.*\/add-activity\/2/)
    await page.locator('button.govuk-button', { hasText: 'Continue without adding other activities' }).click()

    // confirm number of sessions
    await page.waitForURL(/service-provider\/action-plan\/.*\/number-of-sessions/)
    await page.fill('#number-of-sessions', numberOfSessions.toString())
    await page.locator('button.govuk-button').click()
    await page.waitForURL(/service-provider\/action-plan\/.*\/review/)

    // submit for approval
    await page.locator('button.govuk-button').click()
    await page.waitForURL(/service-provider\/action-plan\/.*\/confirmation/)

    // return to service progress
    await page.click('a.govuk-button')
    await expect(page).toHaveURL(/service-provider\/referrals\/.*\/progress/)
}

export const approveActionPlan = async (page: Page, referralRef: string) => {
    await page.locator('a.moj-sub-navigation__link', { hasText: 'Open cases' }).click()
    await expect(page).toHaveURL(/probation-practitioner\/dashboard\/open-cases/)
    const referralLinkLocator = page.locator('tr', { hasText: referralRef }).locator('a', { hasText: 'View' })
    const dateSentHeaderLocator = page.locator('.govuk-table__header', { hasText: 'Date sent' })

    try {
        await referralLinkLocator.click()
    } catch {
        await dateSentHeaderLocator.click()
        await referralLinkLocator.click()
    }

    await expect(page).toHaveURL(/probation-practitioner\/referrals\/.*\/progress/)
    await page.locator('a.govuk-link', { hasText: 'View action plan' }).click()
    await expect(page).toHaveURL(/probation-practitioner\/referrals\/.*\/action-plan/)
    await page.locator('label.govuk-checkboxes__label').click()
    await page.locator('button.govuk-button').click()
    await expect(page).toHaveURL(/probation-practitioner\/referrals\/.*\/action-plan\/approved/)
    await page.locator('a.govuk-button').click()
    await expect(page).toHaveURL(/probation-practitioner\/referrals\/.*\/progress/)
}
