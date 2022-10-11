import {expect, Page} from '@playwright/test'
import {faker} from '@faker-js/faker'
import {findOffenderByCRN} from '../offender/find-offender'
import {fillDate, fillTime, selectOption} from '../utils/inputs'
import {waitForAjax} from '../utils/refresh'
import {Yesterday} from '../utils/date-time'
import {data} from '../../../test-data/test-data'

const autoAddComponent = ['ORA Community Order']
const autoAddCourtReport = ['Adjourned - Pre-Sentence Report']

export interface CreateEvent {
    crn: string
    allocation?: {
        providerName?: string
        teamName?: string
        staffName?: string
    }
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

export async function createEvent(page: Page, {crn, allocation = {}, event}: CreateEvent): Promise<CreatedEvent> {
    const createdEvent = new CreatedEvent()
    await findOffenderByCRN(page, crn)
    await page.click('#linkNavigation2EventList')
    await expect(page).toHaveTitle(/Events/)
    await page.locator('input', {hasText: 'Add'}).click()
    const date = faker.date.recent(1, Yesterday())
    await fillDate(page, '#ReferralDate', date)
    await fillDate(page, '#OffenceDate', date)
    await fillDate(page, '#ConvictionDate', date)
    await selectOption(page, '#MainOffence')
    createdEvent.court = await selectOption(page, '#Court')
    await Promise.all([selectOption(page, '#addEventForm\\:Area', allocation.providerName), waitForAjax(page)])
    await Promise.all([selectOption(page, '#addEventForm\\:Team', allocation.teamName), waitForAjax(page)])
    if (allocation.staffName) {
        await selectOption(page, '#addEventForm\\:Staff', allocation.staffName)
    }
    await selectOption(page, '#AppearanceType', event.appearanceType)
    await selectOption(page, '#Plea')
    await Promise.all([selectOption(page, '#addEventForm\\:Outcome', event.outcome), waitForAjax(page)])
    createdEvent.outcome = event.outcome
    if (autoAddComponent.includes(event.outcome)) {
        await selectOption(page, '#OutcomeArea', allocation.providerName)
        await selectOption(page, '#addEventForm\\:OutcomeTeam', allocation.teamName)
    }
    if (event.length) {
        await page.fill('#addEventForm\\:Length', event.length)
    }
    if (event.reportType) {
        await selectOption(page, '#addEventForm\\:Report', event.reportType)
        await selectOption(page, '#addEventForm\\:Remand')
    }

    if (autoAddCourtReport.includes(event.outcome)) {
        await fillDate(page, '#addEventForm\\:NextAppearanceDate', date)
        await fillTime(page, '#AppearanceTime', date)
        await selectOption(page, '#NextCourt')
    }

    //focus on something outside of input to activate onblur
    await page.focus("#content")
    await page.locator('input', {hasText: 'Save'}).click()

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
    {crn, allocation = {}, event = data.events.custodial}: CreateEvent
): Promise<CreatedEvent> {
    return createEvent(page, {crn, allocation, event})
}

export async function createCommunityEvent(
    page: Page,
    {crn, allocation = {}, event = data.events.community}: CreateEvent
): Promise<CreatedEvent> {
    return createEvent(page, {crn, allocation, event})
}
