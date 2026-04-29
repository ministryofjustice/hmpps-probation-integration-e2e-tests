import { APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.PROBATION_ACCESS_CONTROL_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getAccessControlForUserAndPerson(user: string, crn: string) {
    return await (await getContext()).get(`/user/${user}/access/${crn}`)
}
