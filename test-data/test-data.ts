import {commonConfig} from "./environments/common";
import {testEnvironmentData} from "./environments/test";
import {preProdEnvironmentData} from "./environments/pre-prod";

export class TestData {
    events: { [key: string]: { appearanceType: string, outcome: string, length?: string } } = {}
    requirements: { [key: string]: { category: string, subCategory: string, length?: string } } = {}
    staff: { [key: string]: { firstName: string, lastName: string, staffName: string } } = {}
    teams: { [key: string]: { teamName: string, providerName: string } } = {}
}

// Merge environment config with common config and export single `data` object
export const data: TestData = new TestData()
const environmentData: TestData =
    process.env.ENV == "test"     && testEnvironmentData ||
    process.env.ENV == "pre-prod" && preProdEnvironmentData ||
    (() => {
        throw new Error(`Unexpected environment: ${process.env.ENV}. Make sure you set the ENV variable correctly.`)
    })();
Object.keys(environmentData).forEach(key => data[key] = {...commonConfig[key], ...environmentData[key]})
