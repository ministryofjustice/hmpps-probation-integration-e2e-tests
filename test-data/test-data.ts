import { commonData } from './environments/common.js'
import { testEnvironmentData } from './environments/test.js'
import { preProdEnvironmentData } from './environments/pre-prod.js'
import * as dotenv from 'dotenv'

export type Optional<T> = { [K in keyof T]?: T[K] }
export interface Team {
    name: string
    provider: string
    location?: string
}
export interface Staff {
    name: string
    firstName: string
    lastName: string
}
export interface Allocation {
    staff: Staff
    team: Team
}
export interface ContactType {
    category?: string
    type: string
}
export interface Contact extends ContactType {
    relatesTo: string
    instance?: number
    allocation?: Optional<Allocation>
}

export class TestData {
    documentTemplates: { [key: string]: string } = {}
    contacts: { [key: string]: ContactType } = {}
    events: { [key: string]: { appearanceType: string; outcome: string; length?: string; reportType?: string } } = {}
    requirements: { [key: string]: { category: string; subCategory: string; length?: string } } = {}
    staff: { [key: string]: Staff } = {}
    teams: { [key: string]: Team } = {}
    sentencedPrisoner?: { crn: string; bookingId: number }
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
