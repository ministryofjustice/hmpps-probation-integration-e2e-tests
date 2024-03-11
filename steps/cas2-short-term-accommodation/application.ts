import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { getDate, getYear } from 'date-fns'

export async function submitApplication(page: Page, nomisId: string) {
    await startApplication(page)
    await searchForPerson(page, nomisId)
    await confirmEligibilityAndConsent(page)
    await addReferrerDetails(page)
    await checkInformation(page)
    await addPersonalInformation(page)
    await addAddressInformation(page)
    await addEqualityInformation(page)
    await addPreferredAreas(page)
    await confirmFunding(page)
    await addHealthNeeds(page)
    await riskToSelf(page)
    await riskToOthers(page)
    await addOffences(page)
    await hdcDetails(page)
    await checkAnswers(page)
    await expect(page.getByRole('heading', { name: 'Application complete' })).toBeVisible()
}

async function startApplication(page: Page) {
    await page.getByRole('link', { name: 'Start a new referral' }).click()
    await page.getByRole('button', { name: 'Start now' }).click()
    await expect(page).toHaveTitle(/Enter the person's prison number/)
}

async function searchForPerson(page: Page, nomisId: string) {
    await page.getByLabel("Enter the person's prison number").fill(nomisId)
    await page.getByRole('button', { name: 'Search for applicant' }).click()
    await page.getByRole('button', { name: 'Confirm and continue' }).click()
    await expect(page).toHaveTitle(/Check the person is eligible/)
}

async function confirmEligibilityAndConsent(page: Page) {
    await expect(page).toHaveTitle(/Check the person is eligible/)
    await page.getByLabel(/Yes/).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Confirm the person's consent/)
    await page.getByLabel(/Yes/).check()
    await fillPastDate(page, 'When did they give consent?')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(
        "The person's Home Detention Curfew (HDC) licence dates - Short-Term Accommodation (CAS-2)"
    )
    await fillPastDate(page, 'HDC eligibility date')
    await fillPastDate(page, 'conditional release date')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function fillPastDate(page: Page, label: string) {
    await page.getByRole('group', { name: label }).getByLabel('Day').fill(getDate(new Date()).toString())

    await page
        .getByRole('group', { name: label })
        .getByLabel('Month')
        .fill((new Date().getMonth() - 1).toString()) // Subtract 1 to go back two months

    await page.getByRole('group', { name: label }).getByLabel('Year').fill(getYear(new Date()).toString())
}

async function addReferrerDetails(page: Page) {
    await page.getByRole('link', { name: 'Add referrer details' }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('What is your job title?').fill('Tester')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('What is your contact telephone number?').fill('123')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function checkInformation(page: Page) {
    await page.getByRole('link', { name: 'Check information needed from the applicant' }).click()
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addPersonalInformation(page: Page) {
    await page.getByRole('link', { name: 'Add personal information' }).click()
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByTestId('immigrationStatus').selectOption('ukCitizen')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addAddressInformation(page: Page) {
    await page.getByRole('link', { name: 'Add address history' }).click()
    await page.getByLabel('Yes').check()
    await page.getByRole('textbox', { name: 'Address line 1' }).fill(faker.location.street())
    await page.getByRole('textbox', { name: 'Town or city' }).fill(faker.location.city())
    await page.getByRole('textbox', { name: 'Postcode' }).fill(faker.location.zipCode())
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addEqualityInformation(page: Page) {
    await page.getByRole('link', { name: 'Add equality and diversity monitoring information' }).click()
    await page.getByLabel('No, skip the equality questions').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addPreferredAreas(page: Page) {
    await page.getByRole('link', { name: 'Add exclusion zones and preferred areas' }).click()
    await page.getByLabel('First preferred area').fill('London')
    await page.getByLabel('Reason for first preference').fill('Family')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('Second preferred area').fill('Midlands')
    await page.getByLabel('Reason for second preference').fill('More family')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('No', { exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function confirmFunding(page: Page) {
    await page.getByRole('link', { name: 'Confirm funding and ID' }).click()
    await page.getByLabel('Personal money or savings').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addHealthNeeds(page: Page) {
    await page.getByRole('link', { name: 'Add health needs' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle(/Substance misuse needs/)
    for (const checkbox of await page.getByRole('radio', { name: 'No', exact: true }).elementHandles())
        await checkbox.check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Physical health needs/)
    for (const checkbox of await page.getByRole('radio', { name: 'No', exact: true }).elementHandles())
        await checkbox.check()
    await page.getByRole('group', { name: 'Can they live independently?' }).getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Mental health needs/)
    for (const checkbox of await page.getByRole('radio', { name: 'No', exact: true }).elementHandles())
        await checkbox.check()
    await page
        .getByLabel('Describe the issues they have with taking their medication')
        .fill('Describe the issues they have with taking their medication')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Communication and language needs/)
    for (const checkbox of await page.getByRole('radio', { name: 'No', exact: true }).elementHandles())
        await checkbox.check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Learning difficulties and neurodiversity/)
    for (const checkbox of await page.getByRole('radio', { name: 'No', exact: true }).elementHandles())
        await checkbox.check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Brain injury needs/)
    for (const checkbox of await page.getByRole('radio', { name: 'No', exact: true }).elementHandles())
        await checkbox.check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Other health needs/)
    for (const checkbox of await page.getByRole('radio', { name: 'No', exact: true }).elementHandles())
        await checkbox.check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function riskToSelf(page: Page) {
    await page.getByRole('link', { name: 'Add risk to self information' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('textbox').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('textbox').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('textbox').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function riskToOthers(page: Page) {
    await page.getByRole('link', { name: 'Add risk of serious harm (RoSH) information' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByLabel('Who is at risk?').fill(faker.person.fullName())
    await page.getByLabel('What is the nature of the risk?').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('What circumstances are likely to increase risk?').fill(faker.lorem.words())
    await page.getByLabel('When is the risk likely to be greatest?').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('What factors are likely to reduce risk?').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByText('No, this person does not have risk management arrangements').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByText('No', { exact: true }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addOffences(page: Page) {
    await page.getByRole('link', { name: 'Add current offences' }).click()
    await page.getByLabel('Offence title').fill('Stalking')
    await page.getByLabel('Offence category').selectOption('stalkingOrHarassment')
    await page.getByLabel('Day').fill('1')
    await page.getByLabel('Month').fill('1')
    await page.getByLabel('Year').fill('2024')
    await page.getByLabel('How long were they sentenced for?').fill('1 month')
    await page.getByLabel('Provide a summary of the offence').fill('Stalking')
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
    await page.getByRole('link', { name: 'Add offending history' }).click()
    await page.getByLabel('No, they do not have any previous unspent convictions').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function hdcDetails(page: Page) {
    await page.getByRole('link', { name: 'Add CPP details and HDC licence conditions' }).click()
    await page.getByLabel('Full name').fill(faker.person.fullName())
    await page.getByLabel('Probation region').fill('London')
    await page.getByLabel('Contact email address').fill(faker.internet.exampleEmail())
    await page.getByLabel('Contact number').fill('123')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByLabel('No', { exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function checkAnswers(page: Page) {
    await page.getByRole('link', { name: 'Check application answers' }).click()
    await page.getByLabel(/confirm/).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Submit application' }).click()
}
