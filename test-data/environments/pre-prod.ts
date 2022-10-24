import { type TestData } from '../test-data.js'

export const preProdEnvironmentData: TestData = {
    documentTemplates: {
        shortFormatPreSentenceReport: 'BETA Short Format Pre Sentence Report',
        oralPreSentenceReport: 'BETA Oral Pre Sentence Report',
    },
    contacts: {},
    events: {},
    requirements: {},
    staff: {
        allocationsTester1: {
            firstName: 'Carlo',
            lastName: 'Veo',
            staffName: 'Veo, Carlo (NPS - PO)',
        },
        allocationsTester2: {
            firstName: 'Mark',
            lastName: 'Rees',
            staffName: 'Rees, Mark (NPS - PO)',
        },
    },
    teams: {
        allocationsTestTeam: {
            teamName: 'NPS Wales',
            providerName: 'NPS - Wrexham - Team 1',
        },
    },
}
