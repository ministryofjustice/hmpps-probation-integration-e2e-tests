import { TestData } from '../test-data'

// Static / well-known data that should be available in all environments
export const commonData: TestData = {
    documentTemplates: {},
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
            category: 'Curfew',
            subCategory: 'Curfew',
            length: '6',
        },
    },
    staff: {},
    teams: {},
}
