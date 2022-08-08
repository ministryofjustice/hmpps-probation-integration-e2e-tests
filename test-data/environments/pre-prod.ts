import { TestData } from '../test-data'

export const preProdEnvironmentData: TestData = {
    events: {},
    requirements: {},
    staff: {
        allocationsTester1: {
            firstName: 'Carlo',
            lastName: 'Veo',
            staffName: 'Veo, Carlo (NPS - PO)',
        },
        allocationsTester2: {
            firstName: 'Mark',
            lastName: 'Rees',
            staffName: 'Rees, Mark (NPS - PO)',
        },
    },
    teams: {
        allocationsTestTeam: {
            teamName: 'NPS Wales',
            providerName: 'NPS - Wrexham - Team 1',
        },
    },
}
