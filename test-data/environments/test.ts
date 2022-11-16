import { type TestData } from '../test-data.js'

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
        approvedPremisesKeyWorker: {
            firstName: 'Barry',
            lastName: 'Kshlerin',
            staffName: 'Kshlerin, Barry (CRC - Additional Grade)',
        },
    },
    teams: {
        allocationsTestTeam: {
            teamName: 'NPS - Wrexham - Team 1',
            providerName: 'NPS Wales',
        },
        referAndMonitorTestTeam: {
            teamName: 'OMU D',
            providerName: 'NPS North East',
        },
    },
}
