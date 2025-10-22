import { type TestData } from '../test-data'

// Static / well-known data that is unique to the test environment
export const testEnvironmentData: TestData = {
    documentTemplates: {
        shortFormatPreSentenceReport: 'Nat Short format pre-sentence report pilot',
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
        referAndMonitorStaff: {
            name: 'Wood, Natalie (PS - PO)',
            firstName: 'Natalie',
            lastName: 'Wood',
        },
        approvedPremisesKeyWorker: {
            name: 'AutomatedTestUser, AutomatedTestUser (NPS - PO)',
            firstName: 'AutomatedTestUser',
            lastName: 'AutomatedTestUser',
        },
        automatedTestUser: {
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
            name: 'GM Manchester N1',
            provider: 'Greater Manchester',
        },
        approvedPremisesTestTeam: {
            name: 'The Crescent',
            provider: 'North East Region',
        },
        genericTeam: {
            name: 'OMU B',
            provider: 'Wales',
        },
    },
    prisoners: {
        sentencedPrisoner: {
            crn: 'X600508',
            nomsNumber: 'A0260DZ',
            bookingId: 1203957,
        },
        sentencedPrisonerForMatching: {
            crn: 'X757129',
            nomsNumber: 'A1036EA',
            bookingId: 1214269,
        },
        allocatedPrisoner: {
            crn: 'X698315',
            nomsNumber: 'G5012UJ',
        },
        sentencedPrisonerWithReleaseDate: {
            crn: 'X738925',
            nomsNumber: 'A7928DZ',
            bookingId: 1211185,
        },
    },
}
