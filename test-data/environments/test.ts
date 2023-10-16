import { type TestData } from '../test-data'

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
            name: 'OMU A',
            provider: 'NPS North East',
        },
    },
    prisoners: {
        sentencedPrisoner: {
            crn: 'X600508',
            nomsNumber: 'A0260DZ',
            bookingId: 1203957,
        },
        allocatedPrisoner: {
            crn: 'X698315',
            nomsNumber: 'G5012UJ',
        },
    },
}
