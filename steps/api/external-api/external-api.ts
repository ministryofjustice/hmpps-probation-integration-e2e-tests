import { APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.EXTERNAL_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getCaseDetails(crn: string): Promise<CaseDetails> {
    const response = await (await getContext()).get(`/case/${crn}/supervisions`)
    expect(response.ok()).toBeTruthy()
    return response.json()
}

interface CaseDetails {
    supervisions: Supervision[]
}

interface Supervision {
    number: number
    active: boolean
    date: string
    sentence: Sentence
    mainOffence: Offence
    additionalOffences: Offence[]
    courtAppearances: CourtAppearance[]
}

interface Sentence {
    description: string
    date: string
    custodial: boolean
}

interface Offence {
    date: string
    code: string
    description: string
}

interface CourtAppearance {
    type: string
    date: string
    court: string
}
