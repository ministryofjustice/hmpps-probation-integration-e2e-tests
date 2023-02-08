import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { findOffenderByCRN } from '../offender/find-offender.js'
import { fillDate, fillTime, selectOption, selectOptionAndWait } from '../utils/inputs.js'
import { Yesterday } from '../utils/date-time.js'
import { Allocation, data, Optional } from '../../../test-data/test-data.js'

const autoAddComponent = ['ORA Community Order']
const autoAddCourtReport = ['Adjourned - Pre-Sentence Report']
const requiresAdditionalOutcomeDetails = ['ORA Community Order', 'Adult Custody < 12m']

export interface CreateEvent {
    crn: string
    allocation?: Optional<Allocation>
    event?: {
        appearanceType?: string
        outcome?: string
        length?: string
        reportType?: string
    }
}

export class CreatedEvent {
    court: string
    outcome: string
    provider: string
}

export async function createEvent(page: Page, { crn, allocation, event }: CreateEvent): Promise<CreatedEvent> {
    const createdEvent = new CreatedEvent()
    await findOffenderByCRN(page, crn)
    await page.click('#linkNavigation2EventList')
    await expect(page).toHaveTitle(/Events/)
    await page.locator('input', { hasText: 'Add' }).click()
    const date = faker.date.recent(1, Yesterday)
    await fillDate(page, '#ReferralDate', date)
    await fillDate(page, '#OffenceDate', date)
    await fillDate(page, '#ConvictionDate', date)
    await selectOption(page, '#MainOffence')
    createdEvent.court = await selectOption(page, '#Court')
    await selectOptionAndWait(page, '#addEventForm\\:Area', allocation?.team.provider)
    await selectOptionAndWait(page, '#addEventForm\\:Team', allocation?.team.name)
    if (allocation?.staff?.name) {
        await selectOption(page, '#addEventForm\\:Staff', allocation?.staff?.name)
    }
    await selectOption(page, '#AppearanceType', event.appearanceType)
    await selectOption(page, '#Plea')
    await selectOptionAndWait(page, '#addEventForm\\:Outcome', event.outcome)
    createdEvent.outcome = event.outcome
    if (requiresAdditionalOutcomeDetails.includes(event.outcome)) {
        await selectOptionAndWait(page, '#OutcomeArea', allocation?.team.provider)
        await selectOptionAndWait(page, '#addEventForm\\:OutcomeTeam', allocation?.team.name)
    }
    if (event.length) {
        await page.fill('#addEventForm\\:Length', event.length)
    }
    if (event.reportType) {
        await selectOption(page, '#addEventForm\\:Report', event.reportType)
        await selectOption(page, '#addEventForm\\:Remand')
        await selectOption(page, '#OutcomeArea')
    }

    if (autoAddCourtReport.includes(event.outcome)) {
        await fillDate(page, '#addEventForm\\:NextAppearanceDate', date)
        await fillTime(page, '#AppearanceTime', date)
        await selectOption(page, '#NextCourt')
    }

    //focus on something outside of input to activate onblur
    await page.focus('#content')
    await page.locator('input', { hasText: 'Save' }).click()

    const pageTitle = await page.title()
    if (pageTitle === 'Error Page') {
        return await createEvent(page, { crn, allocation, event })
    }
    if (autoAddComponent.includes(event.outcome)) {
        await expect(page).toHaveTitle(/Add Components/)
    } else if (autoAddCourtReport.includes(event.outcome)) {
        await expect(page).toHaveTitle(/Add Court Report/)
    } else {
        await expect(page).toHaveTitle(/Event Details/)
    }
    return createdEvent
}

export async function createCustodialEvent(
    page: Page,
    { crn, allocation, event = data.events.custodial }: CreateEvent
): Promise<CreatedEvent> {
    return createEvent(page, { crn, allocation, event })
}

export async function createCommunityEvent(
    page: Page,
    { crn, allocation, event = data.events.community }: CreateEvent
): Promise<CreatedEvent> {
    return createEvent(page, { crn, allocation, event })
}
