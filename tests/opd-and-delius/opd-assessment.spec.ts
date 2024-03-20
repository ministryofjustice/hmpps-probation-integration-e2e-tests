import { expect, test } from '@playwright/test'
import { login as loginDelius } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import { login as oasysLogin, UserType } from '../../steps/oasys/login'
import { createLayer3CompleteAssessment } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/create-layer3-without-needs'
import { addLayer3AssessmentNeeds } from '../../steps/oasys/layer3-assessment/create-layer3-assessment/add-layer3-needs'
import { createEvent } from '../../steps/delius/event/create-event'
import { faker } from '@faker-js/faker'
import * as dotenv from 'dotenv'
import { navigateToNSIDetailsFromPersonalDetails } from '../../steps/delius/contact/find-contacts'
import { clickSearch } from '../../steps/oasys/task-manager'
import {setProviderEstablishment} from "../../steps/oasys/set-provider-establishment.js";
dotenv.config() // read environment variables into process.env

test('OPD assessment creates an event in Delius', async ({ page }) => {
    await loginDelius(page)
    const dob = faker.date.birthdate({ min: 20, max: 30, mode: 'age' })
    const person = deliusPerson({ sex: 'Male', dob: dob })
    const crn = await createOffender(page, { person })
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
    await oasysLogin(page, UserType.Assessment)
    await createLayer3CompleteAssessment(page, crn, person)
    await addLayer3AssessmentNeeds(page)
    await loginDelius(page)
    await navigateToNSIDetailsFromPersonalDetails(page, crn)
    await expect(page.locator('div:right-of(:text("Non Statutory Intervention:"))').first()).toContainText(
        'OPD Community Pathway'
    )
    await expect(page.locator('div:right-of(:text("Status"))').first()).toContainText('Pending Consultation')
    await expect(page.locator('div:right-of(:text("Notes"))').first()).toContainText('OPD Result: Screened In')
    await expect(page.locator('div:right-of(:text("Notes"))').first()).toContainText(
        'Comment added by OPD and Delius Service'
    )
    await page.locator('[value="Contact List for this NSI"]').click()
    await expect(page).toHaveTitle(/Contact List for NSIs/)
    await page.locator('#ContactListForm\\:contactTable\\:tbody_element').getByRole('link', { name: 'view' }).click()
    await expect(page.locator('#content > h1')).toHaveText('Contact Details')
    await expect(page.locator('div:right-of(:text("Contact Type"))').first()).toContainText(
        'OPD Status - Pending Consultation'
    )
    await expect(page.locator('div:right-of(:text("Notes"))').first()).toContainText('OPD Result: Screened In')
    await expect(page.locator('div:right-of(:text("Relates To"))').first()).toContainText(
        'OPD Community Pathway (OPD Community Pathway)'
    )
})
