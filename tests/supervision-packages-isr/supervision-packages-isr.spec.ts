import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { signAndlock } from '../../steps/oasys/layer1-assessment/sign-and-lock'
import {
    createCommunityEvent,
    createCustodialEvent,
    createDeterminateCustodyEvent,
    createEvent,
} from '../../steps/delius/event/create-event'
import { data } from '../../test-data/test-data'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api'
import { login as managePeopleOnProbationLogin } from '../../steps/manage-a-supervision/login'
import { searchPersonInMPoP } from '../../steps/manage-a-supervision/application'
import { createLayer1CompleteAssessment } from '../../steps/oasys/layer1-assessment/create-layer1-assessment/create-layer1-assessment'
import {
    getCurrentYearAllowance,
    getSupervisionPackagesContext,
} from '../../steps/api/supervision-packages/supervision-packages-api'
import { DateTime } from 'luxon'
import { qa, slow } from '../../steps/common/common'
import { faker } from '@faker-js/faker'

// const person = deliusPerson()
let crn: string
const nomisIds = []
const today = DateTime.now().setLocale('en-gb').toLocaleString(DateTime.DATE_SHORT)

// test('Create a NSD case with a custodial event not eligible for final third', async ({ page }) => {
//     slow()
//
//     // Step 1: Log in to Delius
//     await deliusLogin(page)
// const person = deliusPerson({ sex: 'Male', dob: DateTime.now().minus({ years: 25 }).toJSDate() })
//     // Step 2: Create a person/offender in Delius
//     crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
//
//     // Step 3: Create a custodial event in Delius
//     // await createCustodialEvent(page, { crn })
//     await createDeterminateCustodyEvent(page, { crn })
//
//     await internalTransfer(page, {
//         crn,
//         allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
//         reason: 'Case Allocated to NPS',
//     })
//
//     // Step 4: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
//     const { nomisId } = await createAndBookPrisoner(page, crn, person)
//     nomisIds.push(nomisId)
//
//     // Create an assessment in OASys
//     await oasysLogin(page, UserType.Booking)
//
//     // await createLayer3CompleteAssessment(page, crn, person, 'Yes')
//     await createLayer3CompleteAssessment(page, crn, person, 'Yes', nomisId, true)
//     await signAndlock(page)
//
//     await page.pause()
//     // Test supervision packages endpoint
//     const contextResponse = await getSupervisionPackagesContext(crn)
//     console.log('contextResponse: ' + contextResponse)
//     expect(contextResponse.name.forename).toBe(person.firstName)
//     expect(contextResponse.name.surname).toBe(person.lastName)
//     expect(contextResponse.sentences[0].supervisionPackage.description).toBe('A') // tier
//     expect(contextResponse.sentences[0].type.custodial).toBe(true)
//     // expect(contextResponse.sentences[0].custody.finalThirdDate).toBe(today)
//     expect(contextResponse.nationalSecurityDivision).toBe(true)
//     expect(contextResponse.finalThirdEligibility.eligible).toBe(false)
//
//     const allowanceResponse = await getCurrentYearAllowance(crn)
//     console.log('allowanceResponse: ' + allowanceResponse)
//     expect(allowanceResponse.appointments.allowance).toBe(12) // to confirm
//     expect(allowanceResponse.appointments.scheduled).toBe(12)
//     expect(allowanceResponse.appointments.completed).toBe(0)
//
//     // When the e-supervision case is registered in MPoP
//     // const uuid = await registerCaseInMPoP(page, person, crn)
//
//     // When I login to Manage People on Probation
//     // await managePeopleOnProbationLogin(page)
//
//     // And I search for the CRN
//     // await searchPersonInMPoP(page, crn)
//     // await page.pause()
//
//     // Then the correct supervision package is assigned
//     // await expect(page.locator('h2.govuk-heading-m')).toContainText('Supervision package')
//     // await expect(page.locator('.app-tier-header h3.govuk-heading-s')).toContainText('Tier A')
// })

// test('Create a NSD case with a custodial event and eligible for final third', async ({ page }) => {
//     slow()
//
//     // Step 1: Log in to Delius
//     await deliusLogin(page)
//
//     const person = deliusPerson({ sex: 'Female', dob: DateTime.now().minus({ years: 25 }).toJSDate() })
//
//     // Step 2: Create a person/offender in Delius
//     crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
//
//     // Step 3: Create a custodial event in Delius
//     await createCustodialEvent(page, { crn })
//     // await createCommunityEvent(page, { crn, date: DateTime.now().minus({ months: 5 }).toJSDate() })
//     await internalTransfer(page, {
//         crn,
//         allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
//         reason: 'Case Allocated to NPS',
//     })
//
//     // Step 4: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
//     const { nomisId } = await createAndBookPrisoner(page, crn, person)
//     nomisIds.push(nomisId)
//
//     // Step 5: Create a layer 1 assessment in OASys
//     await oasysLogin(page, UserType.Booking)
//
//     await createLayer1CompleteAssessment(page, crn, person, nomisId, false, '041', '00')
//     await signAndlock(page)
//
//     // await page.pause()
//     // Test supervision packages endpoint
//     const contextResponse = await getSupervisionPackagesContext(crn)
//     // console.log('contextResponse: ' + contextResponse.toString())
//     expect(contextResponse.name.forename).toBe(person.firstName)
//     expect(contextResponse.name.surname).toBe(person.lastName)
//     // expect(contextResponse.sentences[0].supervisionPackage.description).toBe('D') // tier
//     // expect(contextResponse.sentences[0].type.custodial).toBe(true)
//     // expect(contextResponse.sentences[0].custody.finalThirdDate).toBe(today)
//     // expect(contextResponse.nationalSecurityDivision).toBe(true)
//     // expect(contextResponse.finalThirdEligibility.eligible).toBe(true)
//
//     // const allowanceResponse = await getCurrentYearAllowance(crn)
//     // console.log('allowanceResponse: ' + allowanceResponse)
//     // expect(allowanceResponse.appointments.allowance).toBe(12) // to confirm
//     // expect(allowanceResponse.appointments.scheduled).toBe(12)
//     // expect(allowanceResponse.appointments.completed).toBe(0)
//
//     // expect(contextResponse.status()).toBe(200)
//     // const caseDetails = await contextResponse.contextResponse()
//     // expect(JSON.stringify(caseDetails)).toContain(' ')
//     // expect(JSON.stringify(caseDetails)).toContain('Curfew')
// })

test('Create a case that is not eligible for final third', async ({ page }) => {
    slow()

    // Step 1: Log in to Delius
    await deliusLogin(page)

    const person = deliusPerson({ sex: 'Male', dob: DateTime.now().minus({ years: 25 }).toJSDate() })

    // Step 2: Create a person/offender in Delius
    crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })

    // Step 3: Create a community event in Delius
    await createCommunityEvent(page, { crn })
    // await createCommunityEvent(page, { crn, date: DateTime.now().minus({ months: 5 }).toJSDate() })
    // await internalTransfer(page, {
    //     crn,
    //     allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
    //     reason: 'Case Allocated to NPS',
    // })

    // Step 4: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // Step 5: Create a layer 1 assessment in OASys
    await oasysLogin(page, UserType.Booking)

    // await createLayer1CompleteAssessment(page, crn, person, nomisId, false, '041', '00')
    await createLayer1CompleteAssessment(page, crn, person, nomisId, true, '001', '01')
    await signAndlock(page)

    // Check supervision packages endpoint
    // const contextResponse = await getSupervisionPackagesContext(crn)
    // expect(contextResponse.name.forename).toBe(person.firstName)
    // expect(contextResponse.name.surname).toBe(person.lastName)
    // expect(contextResponse.sentences[0].supervisionPackage.description).toBe('D') // tier
    // expect(contextResponse.sentences[0].type.custodial).toBe(true)
    // expect(contextResponse.sentences[0].custody.finalThirdDate).toBe(today)
    // expect(contextResponse.nationalSecurityDivision).toBe(true)
    // expect(contextResponse.finalThirdEligibility.eligible).toBe(true)

    // When I login to Manage People on Probation
    await managePeopleOnProbationLogin(page)

    // And I search for the CRN
    await searchPersonInMPoP(page, crn)

    // Then the correct supervision package is assigned
    await expect(page.locator(qa('crn'))).toContainText(crn)
    await expect(page.locator(qa('name'))).toContainText(`${person.firstName} ${person.lastName}`)
    await expect(page.locator('.supervision-package h3')).toContainText('Supervision package: community sentence')
    await expect(page.locator('.app-tier-header')).toContainText('Tier A')
})

// test('Create a case with a custodial event not eligible for final third', async ({ page }) => {
//     slow()
//
//     // Step 1: Log in to Delius
//     await deliusLogin(page)
//
//     const person = deliusPerson({ sex: 'Female', dob: DateTime.now().minus({ years: 25 }).toJSDate() })
//
//     // Step 2: Create a person/offender in Delius
//     crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
//
//     // Step 3: Create a custodial event in Delius
//     await createCustodialEvent(page, { crn })
//     // await createDeterminateCustodyEvent(page, { crn })
//     // await createCommunityEvent(page, { crn, date: DateTime.now().minus({ months: 5 }).toJSDate() })
//     // await internalTransfer(page, {
//     //     crn,
//     //     allocation: { team: data.teams.nationalSecurityDivisionTestTeam, staff: data.staff.unallocated },
//     //     reason: 'Case Allocated to NPS',
//     // })
//
//     // Step 4: Create an entry in NOMIS (a corresponding person and booking in NOMIS)
//     const { nomisId } = await createAndBookPrisoner(page, crn, person)
//     nomisIds.push(nomisId)
//
//     // Step 5: Create a layer 1 assessment in OASys
//     await oasysLogin(page, UserType.Booking)
//
//     // await createLayer1CompleteAssessment(page, crn, person, nomisId, true, '001', '01')
//     await createLayer1CompleteAssessment(page, crn, person, nomisId, true)
//     await signAndlock(page)
//
//     // When I login to Manage People on Probation
//     await managePeopleOnProbationLogin(page)
//
//     // And I search for the CRN
//     await searchPersonInMPoP(page, crn)
//
//     // Then the correct supervision package is assigned
//     await expect(page.locator(qa('crn'))).toContainText(crn)
//     await expect(page.locator(qa('name'))).toContainText(`${person.firstName} ${person.lastName}`)
//     // await expect(page.locator('h2.govuk-heading-m')).toContainText('Supervision package')
//     await expect(page.locator('.app-tier-header')).toContainText('Tier A')
// })

test.afterAll(async () => {
    for (const nomsId of nomisIds) {
        await releasePrisoner(nomsId)
    }
})
