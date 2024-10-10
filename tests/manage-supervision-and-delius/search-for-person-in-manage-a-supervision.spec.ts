import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import { login as manageASupervisionLogin } from '../../steps/manage-a-supervision/login'
import { createAndBookPrisoner, releasePrisoner } from '../../steps/api/dps/prison-api.js'
import { Allocation, data } from '../../test-data/test-data.js'
import { internalTransfer } from '../../steps/delius/transfer/internal-transfer.js'
import { createCommunityEvent, createCustodialEvent, createEvent } from '../../steps/delius/event/create-event.js'
import { createContact } from '../../steps/delius/contact/create-contact.js'
import { DateTime } from 'luxon'
import { selectOption } from '../../steps/delius/utils/inputs.js'
import { addDays, addMonths } from '../../steps/delius/utils/date-time.js'
import { terminateEvent } from '../../steps/delius/event/terminate-events.js'
const nomisIds = []
dotenv.config() // read environment variables into process.env

test('Search for a person in Manage a Supervision', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    // const crn = await createOffender(page, { person })



    const crn = await createOffender(page, { person, providerName: 'North West Region'})

    // await createEvent(page, {
    //     crn,
    //     event: {
    //         outcome: 'CJA - Std Determinate Custody',
    //         length: '120',
    //         mainOffence: 'Rape - 01900',
    //         subOffence: 'Rape of a female aged 16 or over - 01908',
    //         plea: 'Guilty',
    //         appearanceType: 'Sentence',
    //     },
    // })
    // await createEvent(page, {
    //     crn,
    //     // allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff },
    //     event: {
    //         outcome: 'ORA Adult Custody (inc PSS)',
    //         length: '12',
    //         mainOffence: 'Theft of motor vehicle (Category) - 04800',
    //         subOffence: 'Stealing motor vehicle - 04801',
    //         plea: 'Guilty',
    //         appearanceType: 'Sentence',
    //     },
    // })

    await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    await createCommunityEvent(page, { crn, allocation: { team: data.teams.referAndMonitorTestTeam } })
    // await createCommunityEvent(page, { crn, allocation: { team: data.teams.genericTeam } })

    // await createCustodialEvent(page, {
    //     crn,
    //     allocation: { team: data.teams.referAndMonitorTestTeam },
    //     event: { ...data.events.custodial, length: '9' },
    //     date: addDays(addMonths(DateTime.now(), -9), 8).toJSDate(),
    // })
    await createEvent(page, {
        crn,
        event: {
            outcome: 'CJA - Std Determinate Custody',
            length: '120',
            mainOffence: 'Rape - 01900',
            subOffence: 'Rape of a female aged 16 or over - 01908',
            plea: 'Guilty',
            appearanceType: 'Sentence',
        },
    })
    await terminateEvent(page, crn, '3', 'Completed - early good progress')




    // await createCustodialEvent(page, { crn, allocation: { team: data.teams.approvedPremisesTestTeam } })
    // #j_idt679\:screenErrorPrompt
    // const event = await createEvent(page, {
    //     crn,
    //     event: data.events.adjournedForFastPreSentenceReport,
    //     allocation: { team: data.teams.genericTeam, staff: data.staff.genericStaff },
    // })
    // await selectOption(page, '#SubOffence\\:selectOneMenu', event.subOffence)
    //
    // await createEvent(page, {
    //     crn,
    //     event: {
    //         outcome: 'CJA -Enforcement Order (C&AA 06)',
    //         length: '40',
    //         mainOffence: '(Abduction - 02500)',
    //         subOffence: '(Abduction - 02500)',
    //         plea: 'Guilty',
    //         appearanceType: 'Sentence',
    //     },
    // })


    await internalTransfer(page, {
        crn,
        allocation: { team: {name:"Automated Allocation Team", provider: 'North West Region'},
            staff: {name: "AutomatedTestUser, AutomatedTestUser (PS - Case Administrator)", firstName: "", lastName: "" }},
    })

    // Create an Appointment in Delius with past date
    const appointmentDatePast = DateTime.now().minus({ days: 2 })
    const startTimePast = DateTime.fromFormat('10:00', 'HH:mm').set({
        year: appointmentDatePast.year,
        month: appointmentDatePast.month,
        day: appointmentDatePast.day,
    })
    const endTimePast = DateTime.fromFormat('10:30', 'HH:mm').set({
        year: appointmentDatePast.year,
        month: appointmentDatePast.month,
        day: appointmentDatePast.day,
    })

    await createContact(page, crn, {
        category: 'All/Always',
        type: 'Appointment with External Agency (NS)',
        relatesTo: 'Event 1 - Adult Custody < 12m (6 Months)',
        date: appointmentDatePast.toJSDate(),
        startTime: startTimePast.toJSDate(),
        endTime: endTimePast.toJSDate(),
        outcome: "Attended - Complied",

        allocation: { team: {name:"Automated Allocation Team", provider: 'North West Region'},
            staff: {name: "AutomatedTestUser, AutomatedTestUser (PS - Case Administrator)", firstName: "", lastName: "" }},
    })

    const appointmentDatePast1Month = DateTime.now().minus({ months: 1 })
    const startTimePast1Month = DateTime.fromFormat('10:00', 'HH:mm').set({
        year: appointmentDatePast1Month.year,
        month: appointmentDatePast1Month.month,
        day: appointmentDatePast1Month.day,
    })
    const endTimePast1Month = DateTime.fromFormat('10:30', 'HH:mm').set({
        year: appointmentDatePast1Month.year,
        month: appointmentDatePast1Month.month,
        day: appointmentDatePast1Month.day,
    })

    await createContact(page, crn, {
        category: 'All/Always',
        type: 'Appointment with External Agency (NS)',
        relatesTo: 'Event 1 - Adult Custody < 12m (6 Months)',
        date: appointmentDatePast1Month.toJSDate(),
        startTime: startTimePast1Month.toJSDate(),
        endTime: endTimePast1Month.toJSDate(),
        outcome: "Attended - Complied",

        allocation: { team: {name:"Automated Allocation Team", provider: 'North West Region'},
            staff: {name: "AutomatedTestUser, AutomatedTestUser (PS - Case Administrator)", firstName: "", lastName: "" }},
    })

    const appointmentDatePast2Months = DateTime.now().minus({ months: 2 })
    const startTimePast2Months = DateTime.fromFormat('10:00', 'HH:mm').set({
        year: appointmentDatePast2Months.year,
        month: appointmentDatePast2Months.month,
        day: appointmentDatePast2Months.day,
    })
    const endTimePast2Months = DateTime.fromFormat('10:30', 'HH:mm').set({
        year: appointmentDatePast2Months.year,
        month: appointmentDatePast2Months.month,
        day: appointmentDatePast2Months.day,
    })

    await createContact(page, crn, {
        category: 'All/Always',
        type: 'Appointment with External Agency (NS)',
        relatesTo: 'Event 1 - Adult Custody < 12m (6 Months)',
        date: appointmentDatePast2Months.toJSDate(),
        startTime: startTimePast2Months.toJSDate(),
        endTime: endTimePast2Months.toJSDate(),
        outcome: "Attended - Complied",

        allocation: { team: {name:"Automated Allocation Team", provider: 'North West Region'},
            staff: {name: "AutomatedTestUser, AutomatedTestUser (PS - Case Administrator)", firstName: "", lastName: "" }},
    })

    // Future date******************************************

    // Create an Appointment in Delius with future date
    const appointmentDate = DateTime.now().plus({ days: 2 })
    const startTime = DateTime.fromFormat('10:00', 'HH:mm').set({
        year: appointmentDate.year,
        month: appointmentDate.month,
        day: appointmentDate.day,
    })
    const endTime = DateTime.fromFormat('10:30', 'HH:mm').set({
        year: appointmentDate.year,
        month: appointmentDate.month,
        day: appointmentDate.day,
    })

    await createContact(page, crn, {
        category: 'All/Always',
        type: 'Appointment with External Agency (NS)',
        relatesTo: 'Event 2 - ORA Community Order (6 Months)',
        date: appointmentDate.toJSDate(),
        startTime: startTime.toJSDate(),
        endTime: endTime.toJSDate(),

        allocation: { team: {name:"Automated Allocation Team", provider: 'North West Region'},
            staff: {name: "AutomatedTestUser, AutomatedTestUser (PS - Case Administrator)", firstName: "", lastName: "" }},
    })

    // Create an Appointment in Delius with future date
    const appointmentDateFuture1Month = DateTime.now().plus({ months: 1 })
    const startTimeFuture1Month = DateTime.fromFormat('10:00', 'HH:mm').set({
        year: appointmentDateFuture1Month.year,
        month: appointmentDateFuture1Month.month,
        day: appointmentDateFuture1Month.day,
    })
    const endTimeFuture1Month = DateTime.fromFormat('10:30', 'HH:mm').set({
        year: appointmentDateFuture1Month.year,
        month: appointmentDateFuture1Month.month,
        day: appointmentDateFuture1Month.day,
    })

    await createContact(page, crn, {
        category: 'All/Always',
        type: 'Appointment with External Agency (NS)',
        relatesTo: 'Event 2 - ORA Community Order (6 Months)',
        date: appointmentDateFuture1Month.toJSDate(),
        startTime: startTimeFuture1Month.toJSDate(),
        endTime: endTimeFuture1Month.toJSDate(),

        allocation: { team: {name:"Automated Allocation Team", provider: 'North West Region'},
            staff: {name: "AutomatedTestUser, AutomatedTestUser (PS - Case Administrator)", firstName: "", lastName: "" }},
    })

    // Create an Appointment in Delius with future date
    const appointmentDateFuture2Months = DateTime.now().plus({ months: 2 })
    const startTimeFuture2Months = DateTime.fromFormat('10:00', 'HH:mm').set({
        year: appointmentDateFuture2Months.year,
        month: appointmentDateFuture2Months.month,
        day: appointmentDateFuture2Months.day,
    })
    const endTimeFuture2Months = DateTime.fromFormat('10:30', 'HH:mm').set({
        year: appointmentDateFuture2Months.year,
        month: appointmentDateFuture2Months.month,
        day: appointmentDateFuture2Months.day,
    })

    await createContact(page, crn, {
        category: 'All/Always',
        type: 'Appointment with External Agency (NS)',
        relatesTo: 'Event 2 - ORA Community Order (6 Months)',
        date: appointmentDateFuture2Months.toJSDate(),
        startTime: startTimeFuture2Months.toJSDate(),
        endTime: endTimeFuture2Months.toJSDate(),

        allocation: { team: {name:"Automated Allocation Team", provider: 'North West Region'},
            staff: {name: "AutomatedTestUser, AutomatedTestUser (PS - Case Administrator)", firstName: "", lastName: "" }},
    })



    // export interface Team {
    //     name: string
    //     provider: string
    //     probationDeliveryUnit?: string
    //     localDeliveryUnit?: string
    //     location?: string
    // }
    // const crn = await createOffender(page, { person, providerName: data.teams.genericTeam.provider })
    // const crn = await createOffender(page, { person, providerName: data.teams.npsNorthWestTeam.provider })
    // const crn = await createOffender(page, { person, providerName: 'NPS North West'})
    // const crn = await createOffender(page, { person, providerName: data.teams.npsNorthWestTeam.provider })
    // And a corresponding person and booking in NOMIS
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    nomisIds.push(nomisId)

    // When I login to Manage a Supervision
    await manageASupervisionLogin(page)

    // And I search for the CRN
    await page.getByRole('link', { name: 'Search' }).click()
    await page.getByLabel('Find a person on probation').fill(crn)
    await page.getByRole('button', { name: 'Search' }).click()

    // Then the person appears in the search results and crn & name matches
    await page.locator(`[href$="${crn}"]`).click()
    await expect(page).toHaveTitle('Manage a Supervision - Overview')
    await expect(page.locator('[data-qa="crn"]')).toContainText(crn)
    await expect(page.locator('[data-qa="name"]')).toContainText(person.firstName + ' ' + person.lastName)
})
// test.afterAll(async () => {
//     for (const nomsId of nomisIds) {
//         await releasePrisoner(nomsId)
//     }
// })
