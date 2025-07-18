import { expect, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import { addMonths, getDate, getMonth, getYear, subMonths } from '../delius/utils/date-time'

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
    await page.getByRole('link', { name: 'Start a new application' }).click()
    await expect(page).toHaveTitle('Home - Short-Term Accommodation (CAS-2)')
    await page.getByRole('button', { name: 'Start now' }).click()
    await expect(page).toHaveTitle(/Enter the person's prison number/)
}

async function searchForPerson(page: Page, nomisId: string) {
    await page.getByLabel("Enter the person's prison number").fill(nomisId)
    await page.getByRole('button', { name: 'Search for applicant' }).click()
    await expect(page).toHaveTitle(/Confirm applicant details/)
    await page.getByRole('button', { name: 'Confirm and continue' }).click()
    await expect(page).toHaveTitle(/Check the person is eligible/)
}

async function confirmEligibilityAndConsent(page: Page) {
    await expect(page).toHaveTitle(/Check the person is eligible/)
    await page.getByLabel(/Yes/).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Confirm the person's consent/)
    await page.getByLabel(/Yes/).check()
    await fillDateInput(page, 'When did they give consent?')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(
        "The person's Home Detention Curfew (HDC) licence dates - Short-Term Accommodation (CAS-2)"
    )
    // Fill HDC eligibility date 1 month in the future and ensure it is before the conditional release date
    const hdcEligibilityDate = await fillDateInput(page, 'HDC eligibility date', 1)

    // Fill conditional release date 2 months in the future from today
    const conditionalReleaseDate = await fillDateInput(page, 'conditional release date', 2)

    // Ensure the HDC eligibility date is before the conditional release date
    if (hdcEligibilityDate >= conditionalReleaseDate) {
        throw new Error('HDC eligibility date must be before the conditional release date.')
    }
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function fillDateInput(page: Page, label: string, offsetMonths: number = 0) {
    // Calculate the target date
    const currentDate = DateTime.now()
    const targetDate =
        offsetMonths >= 0 ? addMonths(currentDate, offsetMonths) : subMonths(currentDate, Math.abs(offsetMonths))

    // Ensure the day is valid for the target month
    const validDate = targetDate.startOf('month').set({ day: Math.min(getDate(targetDate), targetDate.daysInMonth) })

    // Fill the date input fields
    await page.getByRole('group', { name: label }).getByLabel('Day').fill(getDate(validDate).toString())
    await page.getByRole('group', { name: label }).getByLabel('Month').fill(getMonth(validDate).toString())
    await page.getByRole('group', { name: label }).getByLabel('Year').fill(getYear(validDate).toString())

    return validDate.toJSDate()
}

async function addReferrerDetails(page: Page) {
    await page.getByRole('link', { name: 'Add referrer details' }).click()
    await expect(page).toHaveTitle(/Confirm your details/)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/What is your job title/)
    await page.getByLabel('What is your job title?').fill('Tester')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/What is your contact telephone number/)
    await page.getByLabel('What is your contact telephone number?').fill('123')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function checkInformation(page: Page) {
    await page.getByRole('link', { name: 'Check information needed from the applicant' }).click()
    await expect(page).toHaveTitle(/Check information needed from the applicant/)
    await page.getByLabel('Yes').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addPersonalInformation(page: Page) {
    await page.getByRole('link', { name: 'Add personal information' }).click()
    await expect(page).toHaveTitle(/Will the person have a working mobile phone when they are released/)
    await page.getByRole('radio', { name: 'No', exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/What is the person's immigration status/)
    await page.getByTestId('immigrationStatus').selectOption('ukCitizen')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addAddressInformation(page: Page) {
    await page.getByRole('link', { name: 'Add address history' }).click()
    await expect(page).toHaveTitle(/Did the person have a previous address before entering custody/)
    await page.getByLabel('Yes').check()
    await page.getByRole('textbox', { name: 'Address line 1' }).fill(faker.location.street())
    await page.getByRole('textbox', { name: 'Town or city' }).fill(faker.location.city())
    await page.getByRole('textbox', { name: 'Postcode' }).fill(faker.location.zipCode())
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addEqualityInformation(page: Page) {
    await page.getByRole('link', { name: 'Add equality and diversity monitoring information' }).click()
    await expect(page).toHaveTitle(/Equality questions/)
    await page.getByLabel('No, skip the equality questions').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addPreferredAreas(page: Page) {
    await page.getByRole('link', { name: 'Add exclusion zones and preferred areas' }).click()
    await expect(page).toHaveTitle(/First preferred area for the person/)
    await page.getByLabel('First preferred area').fill('London')
    await page.getByLabel('Reason for first preference').fill('Family')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Second preferred area for the person/)
    await page.getByLabel('Second preferred area').fill('Midlands')
    await page.getByLabel('Reason for second preference').fill('More family')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Exclusion zones for the person/)
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Does the person have any gang affiliations/)
    await page.getByLabel('No', { exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Family accommodation for the person/)
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function confirmFunding(page: Page) {
    await page.getByRole('link', { name: 'Confirm funding and ID' }).click()
    await expect(page).toHaveTitle(/How will the person pay for their accommodation and service charge/)
    await page.getByLabel('Personal money or wages').first().check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/What is the person's National Insurance number/)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addHealthNeeds(page: Page) {
    await page.getByRole('link', { name: 'Add health needs' }).click()
    await expect(page).toHaveTitle(/Request health information for the person/)
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle(/Substance misuse needs for the person/)
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
    await expect(page).toHaveTitle(/Import the person's risk to self data from OASys/)
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle(/Does the person have an older OASys with risk to self information/)
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/The person's vulnerability/)
    await page.getByRole('textbox').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/risks/)
    await page.getByRole('textbox').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/The person's ACCT notes/)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Additional Information/)
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function riskToOthers(page: Page) {
    await page.getByRole('link', { name: 'Add risk of serious harm (RoSH) information' }).click()
    await expect(page).toHaveTitle(/Import the person's risk of serious harm \(RoSH\) data from OASys/)
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveTitle(/Does the person have an older OASys with risk of serious harm \(RoSH\) information/)
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Create a RoSH summary for this person - Short-Term Accommodation \(CAS-2\)/)
    await page.getByRole('group', { name: 'What risk do they pose to children?' }).getByLabel('Low').check()
    await page.getByRole('group', { name: 'What risk do they pose to the public?' }).getByLabel('Medium').check()
    await page.getByRole('group', { name: 'What risk do they pose to a known adult?' }).getByLabel('Medium').check()
    await page.getByRole('group', { name: 'What risk do they pose to staff?' }).getByLabel('Low').check()
    await page.getByRole('group', { name: 'What’s the overall risk?' }).getByLabel('Medium').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Risk to others for the person/)
    await page.getByLabel('Who is at risk?').fill(faker.person.fullName())
    await page.getByLabel('What is the nature of the risk?').fill(faker.lorem.words())
    await page.getByText('I confirm this information is relevant and up to date.').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Risk management arrangements/)
    await page.getByText('No, this person does not have risk management arrangements').click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Cell share information for the person/)
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Additional risk information for the person/)
    await page.getByText('No', { exact: true }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function addOffences(page: Page) {
    await page.getByRole('link', { name: 'Add current offences' }).click()
    await expect(page).toHaveTitle(/Add a current offence/)
    await page.getByLabel('Offence title').fill('Stalking')
    await page.getByLabel('Offence type').selectOption('stalkingOrHarassment')
    await page.getByLabel('Day').fill('1')
    await page.getByLabel('Month').fill('1')
    await page.getByLabel('Year').fill('2024')
    await page.getByLabel('How long were they sentenced for?').fill('1 month')
    await page.getByLabel('Provide a summary of the offence').fill('Stalking')
    await page.getByLabel('No').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Current offences/)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
    await page.getByRole('link', { name: 'Add offending history' }).click()
    await expect(page).toHaveTitle(/Does the person have any previous unspent convictions/)
    await page.getByLabel('No, they do not have any previous unspent convictions').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function hdcDetails(page: Page) {
    await page.getByRole('link', { name: 'Add CPP details and HDC licence conditions' }).click()
    await expect(page).toHaveTitle(/Who is the person's Community Probation Practitioner \(CPP\)/)
    await page.getByLabel('Full name').fill(faker.person.fullName())
    await page.getByLabel('Probation region').fill('London')
    await page.getByLabel('Contact email address').fill(faker.internet.exampleEmail())
    await page.getByLabel('Contact number').fill('123')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Does the person have any non-standard licence conditions/)
    await page.getByLabel('No', { exact: true }).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page).toHaveTitle(/Task list/)
}

async function checkAnswers(page: Page) {
    await page.getByRole('link', { name: 'Check application answers' }).click()
    await expect(page).toHaveTitle(/Check your answers before sending your application/)
    await page.getByLabel(/confirm/).check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.getByRole('button', { name: 'Submit application' }).click()
}
