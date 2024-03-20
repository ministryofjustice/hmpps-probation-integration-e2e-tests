import { type Page } from '@playwright/test'
import { data, Team } from '../../../test-data/test-data'
import { findEventByCRN } from '../event/find-events'
import { selectOption, selectOptionAndWait } from '../utils/inputs'

export async function createRequirementForEvent(
    page: Page,
    {
        crn,
        eventNumber = 1,
        team,
        requirement = data.requirements.curfew,
    }: {
        crn: string
        eventNumber?: number
        team?: Team
        requirement?: {
            category: string
            subCategory: string
            length?: string
        }
    }
) {
    await findEventByCRN(page, crn, eventNumber)
    await page.click('#linkNavigation3SentenceComponentREQ')
    await page.locator('main', { has: page.locator('h1', { hasText: 'Requirement Types' }) })
    await page.locator('input', { hasText: 'Add' }).click()
    await selectOptionAndWait(page, '#RequirementMainCategory', requirement?.category)
    await selectOptionAndWait(page, '#RequirementSubCategory', requirement?.subCategory)
    await selectOption(page, '#Area', team?.provider)
    await selectOption(page, '#AddSentenceComponentsForm\\:requirement\\:Team', team?.name)
    if (requirement.length) {
        await page.fill('#Length', requirement.length)
    }
    await page.locator('input', { hasText: 'Add' }).click()
    await page.locator('input', { hasText: 'Save' }).click()
}
