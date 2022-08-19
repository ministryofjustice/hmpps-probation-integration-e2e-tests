import { Person } from '../../delius/utils/person'
import {APIRequestContext, expect, request} from '@playwright/test'
import { getToken } from '../auth/get-token'
import {EuropeLondonFormat} from "../../delius/utils/date-time";

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

export async function createAndBookPrisoner(person: Person): Promise<string> {
    const offenderNo = await createPrisoner(person)
    await bookPrisoner(offenderNo)
    return offenderNo
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

export const recallPrisoner = async (offenderNo: string) => {
    const response = await (
        await getContext()
    ).put(`/api/offenders/${offenderNo}/recall`, {
        data: {
            prisonId: 'MDI',
            recallTime: EuropeLondonFormat(new Date()),
            movementReasonCode: '24',
        },
    })
    expect(response.ok()).toBeTruthy()
}
