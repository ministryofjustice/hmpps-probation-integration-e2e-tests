import { expect, type Page } from '@playwright/test'
import { DateTime } from 'luxon'
import { type Person } from '../delius/utils/person'
import { type Address } from '../delius/address/create-address'
import { DeliusDateFormatter } from '../delius/utils/date-time'

export interface SuicideRiskCase {
    crn: string
    person: Person
    address: Address
}

const pageHeading = (page: Page) => page.getByRole('heading', { level: 1 })

const continueTo = async (page: Page, nextPageTitle: string) => {
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(pageHeading(page)).toHaveText(nextPageTitle)
}

const fillAddress = async (page: Page) => {
    await page.getByRole('textbox', { name: 'Building Name (if applicable)' }).fill('1 The Building')
    await page.getByRole('textbox', { name: 'Street Name' }).fill('The Street')
    await page.getByRole('textbox', { name: 'Town or City' }).fill('The Town')
    await page.getByRole('textbox', { name: 'Postcode' }).fill('NE1 1AA')
}

export async function verifyBasicDetails(page: Page, { crn, person, address }: SuicideRiskCase) {
    await expect(pageHeading(page)).toHaveText('Suicide Risk - Basic Details')
    await expect(page.locator('#name')).toContainText(`${person.firstName} ${person.lastName}`)
    await expect(page.locator('#crn')).toHaveText(crn)
    await expect(page.locator('#address')).toContainText(address.street)
    await expect(page.locator('#address')).toContainText(address.zipCode)
    await expect(page.locator('#date-of-birth')).toHaveText(DeliusDateFormatter(person.dob))
    const age = Math.floor(DateTime.now().diff(DateTime.fromJSDate(person.dob), 'years').years)
    await expect(page.locator('#calculated-age')).toHaveText(age.toString())
}

export async function completeInformation(page: Page) {
    await page.locator('#additionalInfo').fill('Minimal risk')
}

export async function completeTreatment(page: Page) {
    await page.locator('#current-psych-treatment').fill('Minimal treatment')
}

// The form can't be published without at least one recipient
export async function addPrisonEstablishmentRecipient(page: Page) {
    await page.locator('#add-prison-establishment--button').click()
    await expect(pageHeading(page)).toContainText('Recipient Details')
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('The Prison')
    await page.getByRole('textbox', { name: 'Address Number (if applicable)' }).fill('1')
    await page.getByRole('textbox', { name: 'Street Name' }).fill('The Street')
    await page.getByRole('textbox', { name: 'Town or City' }).fill('The Town')
    await page.getByRole('textbox', { name: 'Postcode' }).fill('NE1 1AA')
    await page.getByRole('group', { name: 'Are you going to send this' }).getByLabel('Yes').check()
    await page.getByRole('group', { name: 'Do you want the system to' }).getByLabel('No').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(pageHeading(page)).toHaveText('Suicide Risk - Recipients')
    await expect(page.getByText('The Prison')).toBeVisible()
}

export async function signAsResponsibleOfficer(page: Page) {
    await page.getByRole('radio', { name: 'Responsible Officer', exact: true }).check()
    const emailAddress = page.getByRole('textbox', { name: 'Officer Email Address' })
    // Only editable when Delius doesn't have an email address for the officer
    if (await emailAddress.isVisible()) await emailAddress.fill('test@example.com')
    await page.getByRole('button', { name: 'Click here to sign now' }).click()
    await expect(page.locator('#signature')).not.toBeEmpty()

    // Only shown when Delius doesn't have a work address for the officer
    const addAddress = page.getByRole('button', { name: 'Add Address' })
    if (await addAddress.isVisible()) {
        await addAddress.click()
        await expect(pageHeading(page)).toHaveText('Please enter an Address')
        await fillAddress(page)
        await page.getByRole('button', { name: 'Save' }).click()
        await expect(pageHeading(page)).toHaveText('Suicide Risk - Sign and Send')
    }

    // Only editable when Delius doesn't have a telephone number for the officer
    const telephoneNumber = page.getByRole('textbox', { name: 'Telephone Number' })
    if (await telephoneNumber.isVisible()) await telephoneNumber.fill('07700900001')
}

export async function verifyCheckYourAnswers(page: Page, { crn }: SuicideRiskCase) {
    await expect(page.getByText(crn)).toBeVisible()
    await expect(page.locator('#additional-information')).toHaveText('Minimal risk')
    await expect(page.locator('#current-psychiatric-treatment')).toHaveText('Minimal treatment')
}

// Starts on the Basic Details page and finishes on the Check Your Answers page
export async function completeSuicideRiskForm(page: Page, suicideRiskCase: SuicideRiskCase) {
    await verifyBasicDetails(page, suicideRiskCase)
    await continueTo(page, 'Suicide Risk - Information')
    await completeInformation(page)
    await continueTo(page, 'Suicide Risk - Treatment')
    await completeTreatment(page)
    await continueTo(page, 'Suicide Risk - Recipients')
    await addPrisonEstablishmentRecipient(page)
    await continueTo(page, 'Suicide Risk - Sign and Send')
    await signAsResponsibleOfficer(page)
    await continueTo(page, 'Suicide Risk - Check Your Answers')
    await verifyCheckYourAnswers(page, suicideRiskCase)
}

export async function publishSuicideRiskForm(page: Page) {
    await page.getByRole('button', { name: 'Publish' }).click()
    await expect(page).toHaveURL(/\/report-completed\//)
    await expect(page.getByText('Suicide Risk - Form Completed')).toBeVisible()
}
