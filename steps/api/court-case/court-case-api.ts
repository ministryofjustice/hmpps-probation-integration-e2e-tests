import { APIRequestContext, request } from '@playwright/test'
import { getToken } from '../auth/get-token'

async function getContext(): Promise<APIRequestContext> {
    const token = await getToken()
    return request.newContext({
        baseURL: process.env.COURT_HEARING_EVENT_RECEIVER_URL,
        extraHTTPHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function addCourtHearing(hearing: CourtHearing) {
    return await (
        await getContext()
    ).post(`/hearing/${hearing.hearing.id}`, {
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(hearing),
        failOnStatusCode: true,
    })
}

interface CourtHearing {
    hearing: {
        jurisdictionType: string
        courtCentre: { code: string; id: string; roomId: string; roomName: string; name: string }
        prosecutionCases: {
            caseMarkers: { markerTypeDescription: string }[]
            defendants: {
                offences: {
                    offenceLegislation: string
                    offenceTitle: string
                    offenceCode: string
                    listingNumber: number
                    judicialResults: {
                        resultText: string
                        label: string
                        judicialResultTypeId: string
                        isConvictedResult: boolean
                    }[]
                    verdict: { verdictType: { description: string } }
                    id: string
                    wording: string
                    plea: { pleaValue: string }
                    offenceDefinitionId: string
                }[]
                id: string
                pncId: string
                prosecutionCaseId: string
                personDefendant: {
                    personDetails: {
                        firstName: string
                        lastName: string
                        address: {
                            address3: string
                            address2: string
                            address1: string
                            postcode: string
                            address5: string
                        }
                        gender: string
                        contact: { work: string; mobile: string; email: string; home: string }
                        dateOfBirth: string
                        title: string
                    }
                }
            }[]
            initiationCode: string
            id: string
            prosecutionCaseIdentifier: {
                caseURN: string
                prosecutionAuthorityId: string
                prosecutionAuthorityCode: string
            }
        }[]
        id: string
        type: { description: string; id: string }
        hearingDays: { sittingDay: string; listedDurationMinutes: number }[]
    }
}
