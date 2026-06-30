import { APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getEsupervisionContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.ESUPERVISION_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

// Creates an eSupervision offender check-in for the given CRN & dueDate and returns the UUID.
export async function createOffenderCheckin(crn: string, dueDate: string): Promise<string> {
    const ctx = await getEsupervisionContext()

    const response = await ctx.post('/v2/offender_checkins/crn', {
        data: {
            practitioner: 'AutomatedTestUser',
            offender: crn,
            dueDate,
        },
    })

    expect(response.ok(), await response.text()).toBeTruthy()
    const { uuid } = await response.json()
    return uuid
}
