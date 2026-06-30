import { APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.SENTENCE_PLAN_AND_DELIUS_URL,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getCaseDetails(crn: string): Promise<CaseDetails> {
    const response = await (await getContext()).get(`/case-details/${crn}`)
    expect(response.ok()).toBeTruthy()
    return response.json()
}

interface CaseDetails {
    name: Name
    crn: string
}

interface Name {
    forename: string
    middleName: string
    surname: string
}
