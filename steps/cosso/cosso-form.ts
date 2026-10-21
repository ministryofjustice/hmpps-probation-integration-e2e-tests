import { expect, type Page } from '@playwright/test'
import { type Person } from '../delius/utils/person'
import { type Address } from '../delius/address/create-address'
import { DeliusDateFormatter } from '../delius/utils/date-time'

export interface CossoCase {
    crn: string
    person: Person
    address: Address
    mobileNumber: string
}

const continueTo = async (page: Page, nextPageTitle: string) => {
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.locator('#page-title')).toHaveText(nextPageTitle)
}

export async function verifyBasicDetails(page: Page, { crn, person, address, mobileNumber }: CossoCase) {
    await expect(page.locator('#page-title')).toHaveText('Basic details')
    await expect(page.locator('#name')).toContainText(`${person.firstName} ${person.lastName}`)
    await expect(page.locator('#date-of-birth')).toHaveText(DeliusDateFormatter(person.dob))
    await expect(page.locator('#crn')).toHaveText(crn)
    await expect(page.locator('#address')).toContainText(address.street)
    await expect(page.locator('#address')).toContainText(address.zipCode)
    await expect(page.locator('#mobile-number')).toHaveText(mobileNumber)
}

export async function completeWitnessDetails(page: Page) {
    await page.getByRole('button', { name: 'Add Address' }).click()
    await page.getByRole('textbox', { name: 'Building Name (if applicable)' }).fill('1 The Building')
    await page.getByRole('textbox', { name: 'Street Name' }).fill('The Street')
    await page.getByRole('textbox', { name: 'Town or City' }).fill('The Town')
    await page.getByRole('textbox', { name: 'Postcode' }).fill('NE1 1AA')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('#page-title')).toHaveText('RO and witness details')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('07700900001')
    await page.getByRole('textbox', { name: 'Email Address' }).fill('test@example.com')
    await page.getByRole('textbox', { name: 'Witness Availability' }).fill('Available')
}

export async function completeOffenceDetails(page: Page) {
    await page.getByRole('radio', { name: 'No' }).check()
}

export async function completeFailuresAndEnforcement(page: Page) {
    await page.getByRole('textbox', { name: 'Why is this person in breach?' }).fill('Breach')
    await page.getByRole('textbox', { name: 'What steps have been taken to prevent this breach?' }).fill('None')
    await page.getByRole('radio', { name: 'No' }).check()
    await page.getByRole('checkbox', { name: /I confirm that equalities and diversity information/ }).check()
    await page.getByRole('radio', { name: 'The Order is continued' }).check()
    await page.getByRole('textbox', { name: /Comments to support the/ }).fill('Recommendation')
}

export async function completeCompliance(page: Page) {
    await page.locator('#complianceToDate').fill('Compliant')
}

export async function signAsResponsibleOfficer(page: Page) {
    await page.getByRole('radio', { name: 'Responsible Officer', exact: true }).check()
    await page.getByRole('button', { name: 'Click here to sign now' }).click()
    await expect(page.getByText(/\(Responsible Officer\)/)).toBeVisible()
}

export async function verifyCheckYourAnswers(page: Page, { crn, person }: CossoCase) {
    await expect(page.locator('#crn')).toHaveText(crn)
    await expect(page.locator('#dob')).toHaveText(DeliusDateFormatter(person.dob))
}

// Starts on the Basic details page and finishes on the Check your answers page
export async function completeCossoForm(page: Page, cossoCase: CossoCase) {
    await verifyBasicDetails(page, cossoCase)
    await continueTo(page, 'RO and witness details')
    await completeWitnessDetails(page)
    await continueTo(page, 'Offence details')
    await completeOffenceDetails(page)
    await continueTo(page, 'Failures and Enforcement')
    await completeFailuresAndEnforcement(page)
    await continueTo(page, 'Compliance to date')
    await completeCompliance(page)
    await continueTo(page, 'Signature')
    await signAsResponsibleOfficer(page)
    await continueTo(page, 'Check your answers')
    await verifyCheckYourAnswers(page, cossoCase)
}

export async function publishCossoForm(page: Page) {
    await page.getByRole('button', { name: 'Publish' }).click()
    await expect(page).toHaveURL(/\/report-completed\//)
    await expect(page.getByText('Breach Report COSSO – Report Completed')).toBeVisible()
}
