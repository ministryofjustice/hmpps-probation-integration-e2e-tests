import { APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.RESETTLEMENT_PASSPORT_AND_DELIUS_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getCommunityManager(crn: string): Promise<CommunityManager> {
    const response = await (await getContext()).get(`/probation-cases/${crn}/community-manager`)

    expect(response.ok()).toBeTruthy()
    return response.json()
}

interface CommunityManager {
    name: Name
    unallocated: boolean
}

interface Name {
    forename: string
    surname: string
}
