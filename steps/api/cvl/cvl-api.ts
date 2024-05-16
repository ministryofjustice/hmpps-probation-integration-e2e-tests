import { type APIRequestContext, Page, request } from '@playwright/test'
import { getToken } from '../auth/get-token'
import { retry, sanitiseError } from '../utils/api-utils'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.CVL_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getLicenceIds = retry(
    sanitiseError(async (crn: string) => {
        const response = await (
            await getContext()
        ).get(`/public/licence-summaries/crn/${crn}`, {
            failOnStatusCode: true,
        })
        const json = await response.json()
        return json.filter(l => l.statusCode !== "INACTIVE").map(l => l.id)
    })
)

export const discardAllLicences = async function (crn: string){
   const licenceIds = await getLicenceIds(crn)
    for (const id of licenceIds) {
        await discardLicence(id);
    }
}

export const discardLicence = retry(
    sanitiseError(async (licenceId: string) => {
        const response = await (
            await getContext()
        ).post(`/licence/id/${licenceId}/override/status`, {
            failOnStatusCode: true,
            data: {
                statusCode: 'INACTIVE',
                reason: 'Testing',
            },
        })
    })
)
