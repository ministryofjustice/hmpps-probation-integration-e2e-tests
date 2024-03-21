import { expect, type Page } from '@playwright/test'

export const prepareCaseForSentenceLogin = async (page: Page) => {
    await page.goto(process.env.PREPARE_A_CASE_FOR_SENTENCE_URL)
    await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
    await page.fill('#username', process.env.DELIUS_USERNAME!)
    await page.fill('#password', process.env.DELIUS_PASSWORD!)
    await page.locator('#submit', { hasText: 'Sign in' }).click()
    await expect(page).toHaveTitle('Which courts do you work in? - Prepare a case for sentence')
}
