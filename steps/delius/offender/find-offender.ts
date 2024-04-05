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
        await page.locator('a', { hasText: 'Case Management' }).click()
    } else {
        // Search for offender
        await page.locator('a', { hasText: 'National search' }).click()
        await expect(page).toHaveTitle(/National Search/)
        await page.fill('#crn\\:inputText', crn)
        await selectOption(page, '#otherIdentifier', '[Not Selected]')
        await page.click('#searchButton')
        await page.locator('tr', { hasText: crn }).locator('a', { hasText: 'View' }).click()
    }
    await expect(page).toHaveTitle(/Case Summary/)
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
    const crnLocator = page.locator('#offender-overview a[title*="Case Reference Number"]')
    return (await crnLocator.count()) > 0 && (await crnLocator.first().textContent()) === crn
}
