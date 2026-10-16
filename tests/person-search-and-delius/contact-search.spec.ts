import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { findContactsByCRN } from '../../steps/delius/contact/find-contacts'

const crn = 'Y074221'

test.beforeEach(async ({ page }) => {
    await deliusLogin(page)
    await findContactsByCRN(page, crn)
    await page.getByRole('button', { name: 'Text Search', exact: true }).click()
    await expect(page).toHaveTitle(/Text Search/)
})

for (const keyword of [
    'drugs',
    'prison',
    'crime',
    'court',
    'hmp',
    'occupy',
    'supervision',
    'arrest',
    'rehabilitate',
    'remand',
    'custody',
    'prisoner',
    'home',
]) {
    test(`can find semantic contact results for "${keyword}"`, async ({ page }, testInfo) => {
        await page.locator('#searchContents\\:notesField').fill(keyword)
        const startedAt = performance.now()
        const responsePromise = page.waitForResponse(
            response =>
                response.request().method() === 'POST' &&
                (response.request().postData()?.includes('textSearchButton') ?? false)
        )
        await page.locator('#textSearchButton').click()
        const response = await responsePromise
        await response.finished()

        const results = page.locator('tbody > tr').filter({ has: page.locator('td:not([colspan])') })
        await expect(results.first()).toBeVisible()
        const durationMs = Math.round(performance.now() - startedAt)
        console.log(`Search "${keyword}": ${durationMs} ms from submission to visible results`)
        testInfo.annotations.push({
            type: 'search-duration',
            description: `"${keyword}": ${durationMs} ms from submission to visible results`,
        })
        // Check the notes, not the contact type, which can contain the keyword.
        const notes = results.locator('td:nth-child(5)')
        await expect(notes.filter({ hasNotText: new RegExp(`\\b${keyword}\\b`, 'i') }).first()).toBeVisible()
    })
}
