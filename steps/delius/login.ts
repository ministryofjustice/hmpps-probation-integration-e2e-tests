import { expect, type Page } from '@playwright/test'

const pagesWithOffenderMessageHandler = new WeakSet<Page>()

// Delius can show an offender message (e.g. "Risk To Staff") at any point after opening a case, which blocks clicks
const dismissOffenderMessages = async (page: Page) => {
    if (pagesWithOffenderMessageHandler.has(page)) return
    pagesWithOffenderMessageHandler.add(page)
    const offenderMessage = page.locator('#offenderMessageModal')
    await page.addLocatorHandler(offenderMessage, async () => {
        await offenderMessage.getByRole('button', { name: 'OK' }).click()
    })
}

export const login = async (page: Page) => {
    await dismissOffenderMessages(page)
    await page.goto(process.env.DELIUS_URL)
    const deliusTitle = 'National Delius Home Page'
    const title = await page.locator('title').textContent()

    // may already be logged in
    if (title == deliusTitle) {
        return
    }

    await expect(page).toHaveTitle(/National Delius - Login/)
    await page.fill('#j_username', process.env.DELIUS_USERNAME!)
    await page.fill('#j_password', process.env.DELIUS_PASSWORD!)
    await page.locator('.btn-primary', { hasText: 'Login' }).click()
    await expect(page).toHaveTitle(deliusTitle)
}
