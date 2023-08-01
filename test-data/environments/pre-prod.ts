import { type TestData } from '../test-data'

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
            name: 'Veo, Carlo (NPS - PO)',
        },
        allocationsTester2: {
            firstName: 'Mark',
            lastName: 'Rees',
            name: 'Rees, Mark (NPS - PO)',
        },
    },
    teams: {
        allocationsTestTeam: {
            name: 'NPS Wales',
            provider: 'NPS - Wrexham - Team 1',
            location: 'Wrexham Team Office',
        },
    },
}
