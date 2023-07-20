import {test} from "@playwright/test";
import {login as loginDelius} from "../../steps/delius/login";
import {deliusPerson} from "../../steps/delius/utils/person";
import {createOffender} from "../../steps/delius/offender/create-offender";
import {data} from "../../test-data/test-data";
import {createCommunityEvent, createCustodialEvent} from "../../steps/delius/event/create-event";
import {createAndBookPrisoner} from "../../steps/api/dps/prison-api";
import {login as oasysLogin, UserType} from "../../steps/oasys/login";
import {
    createLayer3AssessmentWithoutNeeds
} from "../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs";
import {createLayer3Assessment} from "../../steps/oasys/layer3-assessment/create-assessment";
import {addLayer3AssessmentNeeds} from "../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs";

test.beforeEach(async ({page}) => {
    await loginDelius(page)
})

test('Create a crn with a single event', async ({page}) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    await createCustodialEvent(page, {crn, allocation: {team: data.teams.approvedPremisesTestTeam}})

    await createAndBookPrisoner(page, crn, person)

    await oasysLogin(page, UserType.Booking)
    await createLayer3AssessmentWithoutNeeds(page, crn)
    await addLayer3AssessmentNeeds(page)
})

test('Create a crn without noms data', async ({page}) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    await createCustodialEvent(page, {crn, allocation: {team: data.teams.approvedPremisesTestTeam}})

    await oasysLogin(page, UserType.Booking)
    await createLayer3AssessmentWithoutNeeds(page, crn)
    await addLayer3AssessmentNeeds(page)
})

test('Create a crn without oasys data', async ({page}) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    await createCustodialEvent(page, {crn, allocation: {team: data.teams.approvedPremisesTestTeam}})

    await createAndBookPrisoner(page, crn, person)
})

test('Create a crn without noms or oasys data', async ({page}) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    await createCustodialEvent(page, {crn, allocation: {team: data.teams.approvedPremisesTestTeam}})
})

test('Create a crn with multiple events', async ({page}) => {
    await loginDelius(page)
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
        person,
        providerName: data.teams.approvedPremisesTestTeam.provider,
    })
    await createCommunityEvent(page, {crn, allocation: {team: data.teams.approvedPremisesTestTeam}})
    await createCustodialEvent(page, {crn, allocation: {team: data.teams.approvedPremisesTestTeam}})

    await createAndBookPrisoner(page, crn, person)

    await oasysLogin(page, UserType.Booking)
    await createLayer3AssessmentWithoutNeeds(page, crn)
})