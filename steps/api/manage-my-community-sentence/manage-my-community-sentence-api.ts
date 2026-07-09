import { APIRequestContext, APIResponse, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.MANAGE_MY_COMMUNITY_SENTENCE_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getPersonalDetails(crn: string): Promise<APIResponse> {
    return (await getContext()).get(`/person/${crn}/personal-details`)
}

export async function getSentences(crn: string): Promise<APIResponse> {
    return (await getContext()).get(`/person/${crn}/sentences`)
}

export async function getPastAppointments(crn: string): Promise<APIResponse> {
    return (await getContext()).get(`/person/${crn}/past-appointments`)
}