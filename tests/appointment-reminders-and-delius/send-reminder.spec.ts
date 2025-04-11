import { expect, test } from '@playwright/test'
import * as dotenv from 'dotenv'
import { login as deliusLogin } from '../../steps/delius/login'
import { login as hmppsAuthLogin } from '../../steps/hmpps-auth/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { data } from '../../test-data/test-data'
import { deliusPerson } from '../../steps/delius/utils/person'
import { createCommunityEvent } from '../../steps/delius/event/create-event'
import { createRequirementForEvent } from '../../steps/delius/requirement/create-requirement'
import { selectOption } from '../../steps/delius/utils/inputs'
import { DateTime } from 'luxon'
import { triggerCronJob } from '../../steps/k8s/k8s-utils'
import { findOffenderByCRN } from '../../steps/delius/offender/find-offender'
import { faker } from '@faker-js/faker/locale/en_GB'

dotenv.config() // read environment variables into process.env

let crn: string

test('Send an UPW appointment reminder', async ({ page }) => {
    // Given a person with a unique mobile number and an UPW appointment two days from now
    await deliusLogin(page)
    const person = deliusPerson()
    crn = await createOffender(page, { person })
    const mobileNumber = `07700900${faker.number.int({ min: 4, max: 999 }).toString().padStart(3, '0')}` // in test range [07700900004,07700900999]
    await page.getByRole('button', { name: 'Update' }).click()
    await page.click('#mobile\\:inputText')
    await page.keyboard.type(mobileNumber)
    await page.keyboard.press('Tab')
    await page.getByLabel('SMS Contact:').selectOption('true')
    await page.getByRole('button', { name: 'Save' }).click()
    await createCommunityEvent(page, { crn })
    await createRequirementForEvent(page, {
        crn,
        requirement: data.requirements.unpaidWork,
        team: data.teams.genericTeam,
    })
    await page.getByRole('link', { name: 'Unpaid Work' }).click()
    await page.getByRole('button', { name: 'Allocations' }).click()
    await selectOption(page, '#area\\:selectOneMenu', 'Wales')
    await selectOption(page, '#project\\:selectOneMenu', 'Probation Integration Test Project')
    await selectOption(
        page,
        '#allocationDay\\:selectOneMenu',
        `${DateTime.now().plus({ day: 1 }).toFormat("cccc', Weekly, (09:00 - 17:00) Next available 'dd/MM/yyyy")}`
    )
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('button', { name: 'Save' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // When the reminders job runs
    await triggerCronJob('hmpps-probation-integration-services-dev', 'unpaid-work-appointment-reminders-wales')

    // Then the appointment appears in the appointment reminders service
    await hmppsAuthLogin(page)
    await page.goto(process.env.APPOINTMENT_REMINDERS_URL)
    await page.fill('#from', DateTime.now().toFormat('dd/MM/yyyy'))
    await page.fill('#to', DateTime.now().toFormat('dd/MM/yyyy'))
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.locator('.govuk-table')).toContainText(crn)
    await expect(page.locator('.govuk-table')).toContainText(mobileNumber)
})

test.afterEach(async ({ page }) => {
    // Delete the offender to prevent duplicate mobile numbers
    await deliusLogin(page)
    await findOffenderByCRN(page, crn)
    await page.getByRole('link', { name: 'Event List' }).click()
    await page.getByRole('link', { name: 'delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('link', { name: 'Personal Details' }).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
})
