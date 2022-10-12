import { commonData } from './environments/common'
import { testEnvironmentData } from './environments/test'
import { preProdEnvironmentData } from './environments/pre-prod'
import * as dotenv from 'dotenv'

export class TestData {
    documentTemplates: { [key: string]: string } = {}
    contacts: { [key: string]: { category: string; type: string; team: string; staff: string } } = {}
    events: { [key: string]: { appearanceType: string; outcome: string; length?: string; reportType?: string } } = {}
    requirements: { [key: string]: { category: string; subCategory: string; length?: string } } = {}
    staff: { [key: string]: { firstName: string; lastName: string; staffName: string } } = {}
    teams: { [key: string]: { teamName: string; providerName: string } } = {}
}

dotenv.config() // read environment variables into process.env

// Merge environment config with common config and export single `data` object
export const data: TestData = new TestData()
const environmentData: TestData =
    (process.env.ENV == 'test' && testEnvironmentData) ||
    (process.env.ENV == 'pre-prod' && preProdEnvironmentData) ||
    (() => {
        throw new Error(`Unexpected environment: ${process.env.ENV}. Make sure you set the ENV variable correctly.`)
    })()
Object.keys(environmentData).forEach(key => (data[key] = { ...commonData[key], ...environmentData[key] }))
