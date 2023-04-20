import { type APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token.js'


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

export async function epfContext(crn: String, eventNumber: String): Promise<any> {
    const response = await (
        await getContext()
    ).get(`/case-details/${crn}/${eventNumber}`)

    expect(response.ok()).toBeTruthy()
    return response.json()
}
