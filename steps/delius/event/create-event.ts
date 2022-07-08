import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { DeliusDateFormatter } from '../utils/date-time'
import { findOffenderByCRN } from '../offender/find-offender'

export async function createEventForCRN(
    page: Page,
    crn: string,
    providerName: string = 'NPS Wales',
    teamName: string = 'NPS - Wrexham - Team 1',
    outcome: string = 'ORA Community Order'
) {
    await findOffenderByCRN(page, crn)
    await page.click('id=linkNavigation2EventList')
    await expect(page).toHaveTitle(/Events/)
    await page.locator('input', { hasText: 'Add' }).click()
    const date = DeliusDateFormatter(faker.date.recent())
    await page.fill('id=ReferralDate', date)
    await page.fill('id=OffenceDate', date)
    await page.fill('id=ConvictionDate', date)
    await page.selectOption('id=MainOffence', { label: 'Arson - 05600' })
    await page.selectOption('id=Court', { label: 'Durham Crown Court' })
    await page.selectOption('id=addEventForm:Area', { label: providerName })
    await page.selectOption('id=addEventForm:Team', { label: teamName })
    await page.selectOption('id=AppearanceType', { label: 'Sentence' })
    await page.selectOption('id=Plea', { label: 'Guilty' })
    await page.selectOption('id=addEventForm:Outcome', { label: outcome })
    await page.selectOption('id=OutcomeArea', { label: providerName })
    await page.selectOption('id=addEventForm:OutcomeTeam', { label: teamName })

    await page.fill('id=addEventForm:Length', '6')
    await page.locator('input', { hasText: 'Save' }).click()

    if (outcome === 'ORA Community Order') {
        await expect(page).toHaveTitle(/Add Components/)
    } else {
        await expect(page).toHaveTitle(/Event Details/)
    }
}
