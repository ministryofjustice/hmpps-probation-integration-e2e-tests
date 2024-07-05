import { type APIRequestContext, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.ARNS_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getRisksFromArns(crn: string) {
    return await (await getContext()).get(`/risks/crn/${crn}`)
}
