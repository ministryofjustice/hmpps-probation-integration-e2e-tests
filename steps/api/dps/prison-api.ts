import { type Person } from '../../delius/utils/person.js'
import { type APIRequestContext, expect, Page, request } from '@playwright/test'
import { getToken } from '../auth/get-token.js'
import { EuropeLondonFormat } from '../../delius/utils/date-time.js'
import { setNomisId } from '../../delius/offender/update-offender.js'

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
    return { nomisId: offenderNo, bookingId: bookingId }
}

async function createPrisoner(person: Person): Promise<string> {
    const response = await (
        await getContext()
    ).post(`/api/offenders`, {
        data: {
            firstName: person.firstName,
            lastName: person.lastName,
            dateOfBirth: person.dob,
            gender: person.gender.charAt(0),
        },
    })

    const json = await response.json()
    return json.offenderNo
}

async function bookPrisoner(offenderNo: string) {
    const response = await (
        await getContext()
    ).post(`/api/offenders/${offenderNo}/booking`, {
        data: {
            movementReasonCode: 'N',
            prisonId: 'MDI',
            imprisonmentStatus: 'SENT03',
        },
    })
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    return json.bookingId
}

export const releasePrisoner = async (offenderNo: string) => {
    const response = await (
        await getContext()
    ).put(`/api/offenders/${offenderNo}/release`, {
        data: {
            movementReasonCode: 'CR',
        },
    })
    expect(response.ok()).toBeTruthy()
}

export const temporaryReleasePrisoner = async (offenderNo: string) => {
    const response = await (
        await getContext()
    ).put(`/api/offenders/${offenderNo}/temporary-absence-out`, {
        data: {
            toCity: "18248",
            transferReasonCode: "1"
        },
    })
    expect(response.ok()).toBeTruthy()
}

export const temporaryAbsenceReturn = async (offenderNo: string) => {
    const response = await (
        await getContext()
    ).put(`/api/offenders/${offenderNo}/temporary-absence-arrival`, {
        data: {
            agencyId: "MDI",
            cellLocation: "MDI-RECP"
        },
    })
    expect(response.ok()).toBeTruthy()
}

export const recallPrisoner = async (offenderNo: string) => {
    const date = EuropeLondonFormat(new Date())
    const response = await (
        await getContext()
    ).put(`/api/offenders/${offenderNo}/recall`, {
        data: {
            prisonId: 'MDI',
            recallTime: date,
            movementReasonCode: '24',
        },
    })
    expect(response.ok()).toBeTruthy()
}

export interface CustodyDates {
    calculationUuid: string
    submissionUser: string
    keyDates: {
        sentenceExpiryDate?: string
        confirmedReleaseDate?: string
        conditionalReleaseDate?: string
        conditionalReleaseOverrideDate?: string
        licenceExpiryDate?: string
        paroleEligibilityDate?: string
        topupSupervisionExpiryDate?: string
        homeDetentionCurfewEligibilityDate?: string
    }
}

export const updateCustodyDates = async (bookingId: number, custodyDates: CustodyDates) => {
    const response = await (
        await getContext()
    ).post(`/api/offender-dates/${bookingId}`, {
        data: custodyDates,
    })
    expect(response.ok()).toBeTruthy()
}
