import { type Person } from '../../delius/utils/person'
import { type APIRequestContext, Page, request } from '@playwright/test'
import { getToken } from '../auth/get-token'
import { EuropeLondonFormat, Yesterday } from '../../delius/utils/date-time'
import { setNomisId } from '../../delius/offender/update-offender'
import { retry, sanitiseError } from '../utils/api-utils'
import { v4 as uuid } from 'uuid'
import { faker } from '@faker-js/faker'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.PRISON_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function createAndBookPrisoner(page: Page, crn: string, person: Person) {
    const offenderNo = await createPrisoner(person)
    // Link the Nomis entry to the Delius entry before booking to avoid OLE from tier changes
    await setNomisId(page, crn, offenderNo)
    const bookingId = await bookPrisoner(offenderNo)
    console.log('NOMIS ID:', offenderNo)
    console.log('Booking ID:', bookingId)
    return { nomisId: offenderNo, bookingId: bookingId }
}

export const createPrisoner = retry(
    sanitiseError(async (person: Person) => {
        const response = await (
            await getContext()
        ).post(`/api/offenders`, {
            failOnStatusCode: true,
            data: {
                firstName: person.firstName,
                lastName: person.lastName,
                dateOfBirth: person.dob,
                gender: person.sex.charAt(0),
                pncNumber: person.pnc,
            },
        })
        const json = await response.json()
        return json.offenderNo
    })
)

export const bookPrisoner = retry(
    sanitiseError(async (offenderNo: string) => {
        const response = await (
            await getContext()
        ).post(`/api/offenders/${offenderNo}/booking`, {
            failOnStatusCode: true,
            data: {
                movementReasonCode: 'N',
                prisonId: 'SWI',
                imprisonmentStatus: 'SENT03',
            },
        })
        const json = await response.json()
        return json.bookingId
    })
)

export const releasePrisoner = retry(
    sanitiseError(async (offenderNo: string) => {
        await (
            await getContext()
        ).put(`/api/offenders/${offenderNo}/release`, {
            failOnStatusCode: true,
            data: {
                movementReasonCode: 'CR',
            },
        })
    })
)

export const temporaryReleasePrisoner = retry(
    sanitiseError(async (offenderNo: string) => {
        await (
            await getContext()
        ).put(`/api/offenders/${offenderNo}/temporary-absence-out`, {
            failOnStatusCode: true,
            data: {
                toCity: '18248',
                transferReasonCode: '1',
            },
        })
    })
)

export const temporaryAbsenceReturn = retry(
    sanitiseError(async (offenderNo: string) => {
        await (
            await getContext()
        ).put(`/api/offenders/${offenderNo}/temporary-absence-arrival`, {
            failOnStatusCode: true,
            data: {
                agencyId: 'SWI',
                cellLocation: 'SWI-RECP',
            },
        })
    })
)

export const recallPrisoner = retry(
    sanitiseError(async (offenderNo: string) => {
        const date = EuropeLondonFormat(new Date())
        await (
            await getContext()
        ).put(`/api/offenders/${offenderNo}/recall`, {
            failOnStatusCode: true,
            data: {
                prisonId: 'SWI',
                recallTime: date,
                movementReasonCode: '24',
            },
        })
    })
)

export interface CustodyDates {
    sentenceExpiryDate?: string
    confirmedReleaseDate?: string
    conditionalReleaseDate?: string
    conditionalReleaseOverrideDate?: string
    licenceExpiryDate?: string
    paroleEligibilityDate?: string
    topupSupervisionExpiryDate?: string
    homeDetentionCurfewEligibilityDate?: string
}

export const updateCustodyDates = retry(
    sanitiseError(async (bookingId: number, custodyDates: CustodyDates) => {
        await (
            await getContext()
        ).post(`/api/offender-dates/${bookingId}`, {
            failOnStatusCode: true,
            data: {
                calculationUuid: uuid(),
                submissionUser: process.env.DPS_USERNAME,
                keyDates: custodyDates,
            },
        })
    })
)

export interface Alert {
    alertType?: string
    alertCode?: string
    comment?: string
    alertDate?: Date
}

export const createAnAlert = retry(
    sanitiseError(async (bookingId: number, { alertType, alertCode, comment, alertDate }: Alert) => {
        await (
            await getContext()
        ).post(`/api/bookings/${bookingId}/alert`, {
            failOnStatusCode: true,
            data: {
                alertType: alertType,
                alertCode: alertCode,
                comment: comment,
                alertDate: alertDate ?? faker.date.recent({ days: 1, refDate: Yesterday }),
            },
        })
    })
)
