import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import { doUntil } from '../../steps/delius/utils/refresh'
import { createContact } from '../../steps/delius/contact/create-contact'
import { LastMonth, Tomorrow, Yesterday } from '../../steps/delius/utils/date-time'
import { data } from '../../test-data/test-data'

dotenv.config() // read environment variables into process.env

test('Create and search for a person', async ({ page }) => {
    // Given a new person in Delius
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })

    // When I search for the CRN
    await page.locator('a', { hasText: 'New Search' }).click()
    const frame = await page.frameLocator('#elasticsearch-frame')
    await frame.locator('#search').click()
    await frame.locator('#search').fill(crn)
    // Then the person appears in the search results
    await doUntil(
        () => page.keyboard.press('Enter'),
        () => expect(frame.locator('.view-offender-link')).toContainText(person.lastName + ', ' + person.firstName)
    )
})

test('Create and search for contacts', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createContact(page, crn, {
        category: 'Education, Training, Employment',
        type: 'CV Created',
        relatesTo: `Person - ${person.firstName} ${person.lastName}`,
        date: LastMonth,
        allocation: {
            team: data.teams.genericTeam,
            staff: data.staff.genericStaff,
        },
    })
    await createContact(page, crn, {
        category: 'Community Management',
        type: 'Other Contact',
        relatesTo: `Person - ${person.firstName} ${person.lastName}`,
        date: Yesterday,
        allocation: {
            team: data.teams.genericTeam,
            staff: data.staff.genericStaff,
        },
    })
    await createContact(page, crn, {
        category: 'Case Administration',
        type: 'Clerical Officer Contact',
        relatesTo: `Person - ${person.firstName} ${person.lastName}`,
        date: new Date(),
        allocation: {
            team: data.teams.genericTeam,
            staff: data.staff.genericStaff,
        },
    })
    await createContact(page, crn, {
        category: 'Case Administration',
        type: 'Clerical Officer Contact',
        relatesTo: `Person - ${person.firstName} ${person.lastName}`,
        date: Tomorrow,
        allocation: {
            team: data.teams.genericTeam,
            staff: data.staff.genericStaff,
        },
    })

    await page.locator('input.btn', { hasText: /Text Search/ }).click()
    await expect(page).toHaveTitle('Free Text Search')

    await page.click('#textSearchButton')
    // will have the four contacts above plus tier calculation
    await doUntil(
        () => page.click('#textSearchButton'),
        () => expect(page.locator('tbody > tr')).toHaveCount(5)
    )

    await page.fill('#ContactFreeTextSearchForm\\:searchContents', 'CV')
    await page.click('#textSearchButton')

    await expect(page.locator('tbody > tr').first()).toContainText('CV Created')

    await page.fill('#ContactFreeTextSearchForm\\:searchContents', 'Clerical Officer')
    await page.click('#textSearchButton')

    await expect(page.locator('tbody > tr')).toHaveCount(2)
})
