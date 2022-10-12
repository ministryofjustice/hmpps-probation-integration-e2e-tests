import { TestData } from '../test-data'

export const testEnvironmentData: TestData = {
    documentTemplates: {
        shortFormatPreSentenceReport: 'shortFormatPreSentenceReport',
        oralPreSentenceReport: 'Record of Oral Pre-Sentence Report',
    },
    contacts: {
        initialAppointment: {
            category: 'All/Always',
            type: 'Initial Appointment (NS)',
            team: 'Unallocated Team(N03)',
            staff: 'Unallocated',
        },
    },
    events: {},
    requirements: {},
    staff: {
        allocationsTester1: {
            firstName: 'Coco',
            lastName: 'Pint',
            staffName: 'Pint, Coco (NPS - PO)',
        },
        allocationsTester2: {
            firstName: 'Derek',
            lastName: 'Pint',
            staffName: 'Pint, Derek (NPS - PO)',
        },
    },
    teams: {
        allocationsTestTeam: {
            teamName: 'NPS - Wrexham - Team 1',
            providerName: 'NPS Wales',
        },
    },
}
