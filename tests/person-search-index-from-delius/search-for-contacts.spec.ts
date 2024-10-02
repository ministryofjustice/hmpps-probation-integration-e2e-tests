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

test('Create and search for contacts', async ({ page }) => {
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    await createContact(page, crn, {
        category: 'Education, Training, Employment',
        type: 'CV Created',
        relatesTo: `Person - ${person.firstName} ${person.lastName}`,
        date: LastMonth.toJSDate(),
        allocation: {
            team: data.teams.genericTeam,
            staff: data.staff.genericStaff,
        },
    })
    await createContact(page, crn, {
        category: 'Community Management',
        type: 'Other Contact',
        relatesTo: `Person - ${person.firstName} ${person.lastName}`,
        date: Yesterday.toJSDate(),
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
        date: Tomorrow.toJSDate(),
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

    await page.fill('#searchContents\\:notesField', 'CV')
    await page.click('#textSearchButton')

    await expect(page.locator('tbody > tr').first()).toContainText('CV Created')

    await page.fill('#searchContents\\:notesField', 'Clerical Officer')
    await page.click('#textSearchButton')

    await expect(page.locator('tbody > tr')).toHaveCount(2)
})
