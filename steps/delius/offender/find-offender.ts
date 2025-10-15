import { expect, type Page } from '@playwright/test'
import { refreshUntil } from '../utils/refresh'
import { selectOption } from '../utils/inputs'
import { Allocation } from '../../../test-data/test-data'

export async function findOffenderByName(page: Page, forename: string, surname: string) {
    await page.locator('a', { hasText: 'National search' }).click()
    await expect(page).toHaveTitle(/National Search/)
    await page.fill('#firstName\\:inputText', forename)
    await page.fill('#lastName\\:inputText', surname)
    await page.click('#searchButton')
}

export async function findOffenderByCRN(page: Page, crn: string) {
    if (await isInOffenderContext(page, crn)) {
        // Already in offender context, go to case summary
        await dismissModals(page)
        await page.locator('a', { hasText: 'Case Management' }).click()
    } else {
        // Search for offender
        await page.locator('a', { hasText: 'National search' }).click()
        await expect(page).toHaveTitle(/National Search/)
        await page.fill('#crn\\:inputText', crn)
        await selectOption(page, '#otherIdentifier', '[Not Selected]')
        await page.click('#searchButton')
        await page.locator('tr', { hasText: crn }).locator('a', { hasText: 'View' }).click()
        await dismissModals(page)
    }
    await expect(page.getByRole('heading', { name: 'Case Summary' })).toBeVisible({ timeout: 10000 })
}

export async function findOffenderByCRNNoContextCheck(page: Page, crn: string) {
    // Search for offender
    await page.locator('#navigation-include\\:linkNavigation1Search', { hasText: 'National search' }).click()
    await expect(page).toHaveTitle(/National Search/)
    await page.fill('#crn\\:inputText', crn)
    await selectOption(page, '#otherIdentifier', '[Not Selected]')
    await page.click('#searchButton')
    await page.locator('tr', { hasText: crn }).locator('a', { hasText: 'View' }).click()
    await expect(page).toHaveTitle(/Case Summary/)
}

export async function findOffenderByNomisId(page: Page, nomisId: string): Promise<string> {
    await page.locator('a', { hasText: 'National search' }).click()
    await expect(page).toHaveTitle(/National Search/)
    await selectOption(page, '#otherIdentifier', 'NOMS Number')
    await page.fill('#notSelected', nomisId)
    await page.click('#searchButton')
    await page.locator('tr', { hasText: '' }).locator('a', { hasText: 'View' }).click()
    await expect(page).toHaveTitle(/Case Summary/)
    return await page.locator('//*[contains(@title, "Case Reference Number")]').first().textContent()
}

export async function verifyAllocation(page: Page, args: { allocation: Allocation; crn: string }) {
    await page.goto(process.env.DELIUS_URL)

    await findOffenderByCRN(page, args.crn)

    const locator = await page
        .locator("a:right-of(:text('Community Manager:'))", {
            hasText: `${args.allocation.staff.lastName}, ${args.allocation.staff.firstName}`,
        })
        .first()

    await refreshUntil(page, () => expect(locator).not.toHaveCount(0))

    await expect(await locator.textContent()).toEqual(
        `${args.allocation.staff.lastName}, ${args.allocation.staff.firstName}`
    )
    await page.locator('a', { hasText: 'Community Supervisor' }).click()
    await expect(page.locator('#provider\\:outputText')).toHaveText(args.allocation.team.provider)
    await expect(page.locator('#supervisorCommunityTeam\\:outputText')).toHaveText(args.allocation.team.name)
}

export async function isInOffenderContext(page: Page, crn: string): Promise<boolean> {
    try {
        await expect(page.locator('#offender-overview')).toContainText(crn, { timeout: 5000 })
        return true
    } catch (_) {
        return false
    }
}

export async function dismissModals(page: Page) {
    if (await page.locator('#j_idt638\\:screenWarningPrompt').isVisible()) {
        await page.click('[title="Save Court Appearance & Close this screen"]')
    }

    try {
        await page.getByRole('button', { name: 'OK' }).click({ timeout: 5000 })
    } catch (_) {
        //Modal did not disappear within the timeout, continuing...'
    }
}
