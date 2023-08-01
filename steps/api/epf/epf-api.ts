import { type APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.EPF_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function epfContext(crn: string, eventNumber: string): Promise<Response> {
    const response = await (await getContext()).get(`/case-details/${crn}/${eventNumber}`)

    expect(response.ok()).toBeTruthy()
    return response.json()
}

export interface Response {
    name: Name
    dateOfBirth: Date
    gender: string
    sentence: Sentence
    responsibleProvider: ResponsibleProvider
    age: number
}

export interface Name {
    forename: string
    middleName: string
    surname: string
}

export interface ResponsibleProvider {
    code: string
    name: string
}

export interface Sentence {
    date: Date
    sentencingCourt: SentencingCourt
    releaseDate: Date
}

export interface SentencingCourt {
    name: string
}
