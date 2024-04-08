import { expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

export async function triggerMatching(nomsNumber: string) {
    const context = await request.newContext({ baseURL: process.env.PRISON_IDENTIFIER_AND_DELIUS_URL })
    const response = await context.post(`/person/match-by-noms?dryRun=false`, {
        headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify([nomsNumber]),
    })
    expect(response.ok()).toBeTruthy()
}
