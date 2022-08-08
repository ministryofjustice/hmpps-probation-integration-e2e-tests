import { TestData } from '../test-data'

// Static / well-known data that should be available in all environments
export const commonData: TestData = {
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
