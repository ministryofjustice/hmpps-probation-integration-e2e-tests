import { expect, type Page } from '@playwright/test'

export const login = async (page: Page) => {
    // await page.goto(process.env.CAS2_SHORT_TERM_ACCOMMODATION_URL)
    await page.goto('https://temporary-accommodation-test.hmpps.service.justice.gov.uk')
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)
    await page.click('#submit')
    await expect(page).toHaveTitle('Short-Term Accommodation (CAS-2)')
}
