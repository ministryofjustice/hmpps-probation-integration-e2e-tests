import { type TestData } from '../test-data.js'

export const testEnvironmentData: TestData = {
    documentTemplates: {
        shortFormatPreSentenceReport: 'shortFormatPreSentenceReport',
        oralPreSentenceReport: 'Record of Oral Pre-Sentence Report',
    },
    contacts: {
        initialAppointment: {
            category: 'All/Always',
            type: 'Initial Appointment - In office (NS)',
        },
    },
    events: {},
    requirements: {},
    staff: {
        allocationsTester1: {
            name: 'Pint, Coco (NPS - PO)',
            firstName: 'Coco',
            lastName: 'Pint',
        },
        allocationsTester2: {
            name: 'Pint, Derek (NPS - PO)',
            firstName: 'Derek',
            lastName: 'Pint',
        },
        approvedPremisesKeyWorker: {
            name: 'Kshlerin, Barry (CRC - Additional Grade)',
            firstName: 'Barry',
            lastName: 'Kshlerin',
        },
    },
    teams: {
        allocationsTestTeam: {
            name: 'NPS - Wrexham - Team 1',
            provider: 'Wales',
            location: 'Wrexham Team Office',
        },
        referAndMonitorTestTeam: {
            name: 'OMU D',
            provider: 'NPS North East',
        },
    },
    sentencedPrisoner: {
        crn: 'X600508',
        bookingId: 1203957,
    },
}
