import { expect, type Page } from '@playwright/test'
import * as dotenv from 'dotenv'

export const login = async (page: Page) => {
    await page.goto(process.env.APPROVEDPREMISES_URL)

    // await page.goto('https://approved-premises-dev.hmpps.service.justice.gov.uk/')
    const approvedPremisesTitle = 'Approved Premises - Home'
    const title = await page.locator('title').textContent()

    //may already be logged in
    if (title.trim() == approvedPremisesTitle) {
        page.once('dialog', dialog => dialog.accept())
        await page.locator('a', { hasText: 'Sign out' }).click()
    }

    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)

    // await page.fill('#username', 'AutomatedTestUser')
    // await page.fill('#password', 'Password1')
    await page.click('#submit')
    await expect(page).toHaveTitle(approvedPremisesTitle)
}

export const navigateToApplications = async (page: Page) => {
    await page.goto(`${process.env.APPROVEDPREMISES_URL}applications/new`)

    // await page.goto('https://approved-premises-dev.hmpps.service.justice.gov.uk/applications/new')
    await expect(page).toHaveTitle("Approved Premises - Enter the person's CRN")
}
