import { APIRequestContext, APIResponse, expect, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.SUPERVISION_PACKAGES_API,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function getTimeline(crn: string): Promise<APIResponse> {
    return (await getContext()).get(`/case/${crn}/timeline`)
}

export async function getSupervisionPackagesContext(crn: string): Promise<CaseDetails> {
    const response = await (await getContext()).get(`/case/${crn}/context`)
    expect(response.ok()).toBeTruthy()
    return response.json()
}

export async function getCurrentYearAllowance(crn: string): Promise<Allowance> {
    const response = await (await getContext()).get(`/case/${crn}/current-year`)
    expect(response.ok()).toBeTruthy()
    return response.json()
}

interface CaseDetails {
    name: {
        forename: string
        middleNames: string
        surname: string
    }
    gender: string
    sentences: [
        {
            eventNumber: string
            startDate: string
            endDate: string
            supervisionPackage: {
                code: string
                description: string
            }
            type: {
                code: string
                description: string
                custodial: boolean
            }
            custody: {
                status: {
                    code: string
                    description: string
                }
                location: {
                    code: string
                    description: string
                }
                finalThirdDate: string
                releases: [
                    {
                        releaseDate: string
                        recallDate: string
                    },
                ]
            }
            inBreach: boolean
        },
    ]
    integratedOffenderManagementRedRated: boolean
    offenderPersonalDisorderPathway: boolean
    intensiveSupervisionCourt: boolean
    nationalSecurityDivision: boolean
    contactSuspendedDate: string
    finalThirdEligibility: {
        eligible: boolean
        since: string
    }
    liferCategory: {
        code: string
        description: string
    }
    recallStatus: {
        code: string
        description: string
    }
}

interface Allowance {
    startDate: string
    endDate: string
    proRataFromDate: string
    appointments: {
        allowance: number
        scheduled: number
        completed: number
    }
    firstYear: boolean
}
