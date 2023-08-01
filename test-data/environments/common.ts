import { type TestData } from '../test-data'

// Static / well-known data that should be available in all environments
export const commonData: TestData = {
    documentTemplates: {},
    contacts: {},
    events: {
        custodial: {
            appearanceType: 'Sentence',
            outcome: 'Adult Custody < 12m',
            length: '6',
        },
        community: {
            appearanceType: 'Sentence',
            outcome: 'ORA Community Order',
            length: '6',
        },
        appeal: {
            appearanceType: 'Appeal',
            outcome: 'Order to Continue',
        },
        adjournedForFastPreSentenceReport: {
            appearanceType: 'Trial/Adjournment',
            outcome: 'Adjourned - Pre-Sentence Report',
            reportType: 'Pre-Sentence Report - Fast',
        },
        adjournedForOralPreSentenceReport: {
            appearanceType: 'Trial/Adjournment',
            outcome: 'Adjourned - Pre-Sentence Report',
            reportType: 'Pre-Sentence Report - Oral',
        },
    },
    requirements: {
        curfew: {
            category: 'Curfew (Police Checks Only)',
            subCategory: 'Curfew',
            length: '6',
        },
        rar: {
            category: 'Rehabilitation Activity Requirement (RAR)',
            subCategory: 'Rehabilitation Activity Requirement (RAR)',
            length: '10',
        },
        unpaidWork: {
            category: 'Unpaid Work',
            subCategory: 'Regular',
            length: '120',
        },
    },
    staff: {
        unallocated: {
            name: 'Unallocated',
            firstName: 'Unallocated',
            lastName: 'Unallocated',
        },
    },
    teams: {},
}
