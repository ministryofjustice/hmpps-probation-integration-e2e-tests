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
            name: 'Pint, Coco (PS - PO)',
            firstName: 'Coco',
            lastName: 'Pint',
        },
        allocationsTester2: {
            name: 'Pint, Derek (PS - PO)',
            firstName: 'Derek',
            lastName: 'Pint',
        },
        genericStaff: {
            name: 'Cobio, Titus ZZ (NPS - PSO)',
            firstName: 'Titus',
            lastName: 'Cobio',
        },
        approvedPremisesKeyWorker: {
            name: 'AutomatedTestUser, AutomatedTestUser (NPS - PO)',
            firstName: 'AutomatedTestUser',
            lastName: 'AutomatedTestUser',
        },
    },
    teams: {
        allocationsTestTeam: {
            name: 'NPS - Wrexham - Team 1',
            provider: 'Wales',
            probationDeliveryUnit: 'North Wales',
            localDeliveryUnit: 'North Wales',
            location: 'Wrexham Team Office',
        },
        referAndMonitorTestTeam: {
            name: 'OMU D',
            provider: 'NPS North East',
        },
        approvedPremisesTestTeam: {
            name: 'The Crescent',
            provider: 'North East Region',
        },
        genericTeam: {
            name: 'OMU A',
            provider: 'NPS North East',
        },
    },
    sentencedPrisoner: {
        crn: 'X600508',
        bookingId: 1203957,
    },
}
