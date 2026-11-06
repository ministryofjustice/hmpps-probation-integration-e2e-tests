import { APIRequestContext, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const baseURL = process.env.EMDI_API
    if (!baseURL) {
        throw new Error('EMDI_API must be configured for the EMDI API tests')
    }
    const token = await getToken()
    if (!token) {
        throw new Error('HMPPS Auth did not return an access token')
    }
    return request.newContext({
        baseURL,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

async function get<T>(path: string): Promise<T> {
    const context = await getContext()
    try {
        const response = await context.get(path)
        await expect(response).toBeOK()
        expect(response.status()).toBe(200)
        return await response.json()
    } finally {
        await context.dispose()
    }
}

export async function getRegions(): Promise<CodedValue[]> {
    return get('/regions')
}

export async function getPdus(regionCode: string): Promise<CodedValue[]> {
    return get(`/regions/${encodeURIComponent(regionCode)}/pdu`)
}

export async function getTeamsByUsername(username: string): Promise<Teams> {
    return get(`/user/${encodeURIComponent(username)}/teams`)
}

interface CodedValue {
    code: string
    description: string
}

interface Team extends CodedValue {
    pdu: CodedValue
    region: CodedValue
}

interface Teams {
    teams: Team[]
}
