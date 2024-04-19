import { expect, type Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { findOffenderByCRN } from '../offender/find-offender'
import { fillDate, fillTime, selectOption, selectOptionAndWait } from '../utils/inputs'
import { Yesterday } from '../utils/date-time'
import { Allocation, data, Optional } from '../../../test-data/test-data'
import { waitForJS } from '../utils/refresh.js'

const autoAddComponent = ['ORA Community Order']
const autoAddCourtReport = ['Adjourned - Pre-Sentence Report']
const requiresAdditionalOutcomeDetails = ['ORA Community Order', 'Adult Custody < 12m', 'CJA - Std Determinate Custody']

export interface CreateEvent {
    crn: string
    allocation?: Optional<Allocation>
    event?: {
        appearanceType?: string
        outcome?: string
        length?: string
        reportType?: string
        mainOffence?: string
        subOffence?: string
        plea?: string
    }
    date?: Date
}

export class CreatedEvent {
    court: string
    outcome: string
    provider: string
}

export async function createEvent(page: Page, { crn, allocation, event, date }: CreateEvent): Promise<CreatedEvent> {
    const createdEvent = new CreatedEvent()
    await findOffenderByCRN(page, crn)
    await page.click('#navigation-include\\:linkNavigation2EventList')
    await expect(page).toHaveTitle(/Events/)
    await page.locator('input', { hasText: 'Add' }).click()
    const _date = date ?? faker.date.recent({ days: 1, refDate: Yesterday })
    await fillDate(page, '#ReferralDate\\:datePicker', _date)
    await fillDate(page, '#OffenceDate\\:datePicker', _date)
    await fillDate(page, '#ConvictionDate\\:datePicker', _date)
    await waitForJS(page, 1000)
    await selectOptionAndWait(
        page,
        '#MainOffence\\:selectOneMenu',
        event.mainOffence,
        option => !option.startsWith('(')
    )
    if (event.subOffence) {
        await selectOption(page, '#SubOffence\\:selectOneMenu', event.subOffence)
    }
    createdEvent.court = await selectOption(page, '#Court\\:selectOneMenu')
    await selectOptionAndWait(page, '#Area\\:selectOneMenu', allocation?.team?.provider)
    await selectOptionAndWait(page, '#Team\\:selectOneMenu', allocation?.team?.name)
    if (allocation?.staff?.name) {
        await selectOption(page, '#Staff\\:selectOneMenu', allocation?.staff?.name)
    }
    await selectOption(page, '#AppearanceType\\:selectOneMenu', event.appearanceType)
    await selectOptionAndWait(page, '#Plea\\:selectOneMenu', event.plea)
    await selectOptionAndWait(page, '#Outcome\\:selectOneMenu', event.outcome)
    createdEvent.outcome = event.outcome
    if (requiresAdditionalOutcomeDetails.includes(event.outcome)) {
        await selectOptionAndWait(page, '#OutcomeArea\\:selectOneMenu', allocation?.team?.provider)
        await selectOptionAndWait(page, '#OutcomeTeam\\:selectOneMenu', allocation?.team?.name)
    }
    if (event.length) {
        await page.fill('#Length', event.length)
    }
    if (event.reportType) {
        await selectOption(page, '#Report\\:selectOneMenu', event.reportType)
        await selectOption(page, '#Remand\\:selectOneMenu')
        await selectOption(page, '#OutcomeArea\\:selectOneMenu')
    }
    if (autoAddCourtReport.includes(event.outcome)) {
        await fillDate(page, '#NextAppearanceDate\\:datePicker', _date)
        await fillTime(page, '#AppearanceTime\\:timePicker', _date)
        await selectOption(page, '#NextCourt\\:selectOneMenu')
    }
    // focus on something outside of input to activate onblur
    await page.focus('#content')
    await page.locator('input', { hasText: 'Save' }).click()
    const pageTitle = await page.title()
    if (pageTitle === 'Events') {
        await page.locator('input', { hasText: 'Save' }).click()
    }

    try {
        if (autoAddComponent.includes(event.outcome)) {
            await expect(page).toHaveTitle(/Add Components/)
        } else if (autoAddCourtReport.includes(event.outcome)) {
            await expect(page).toHaveTitle(/Add Court Report/)
        } else {
            await expect(page).toHaveTitle(/Event Details/)
        }
    } catch (e) {
        if ((await page.title()) === 'Error Page') {
            return await createEvent(page, { crn, allocation, event })
        }
    }
    return createdEvent
}

export async function createCustodialEvent(
    page: Page,
    { crn, allocation, event = data.events.custodial, date }: CreateEvent
): Promise<CreatedEvent> {
    return createEvent(page, { crn, allocation, event, date })
}

export async function createCommunityEvent(
    page: Page,
    { crn, allocation, event = data.events.community, date }: CreateEvent
): Promise<CreatedEvent> {
    return createEvent(page, { crn, allocation, event, date })
}
