import { expect, test, type FrameLocator, type Locator, type Page } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { noResultSearches, searchData } from '../../test-data/search-data'
import { doUntil } from '../../steps/delius/utils/refresh'
import {
    createSearchPerson,
    escapeRegExp,
    personSearchLinkName,
    removeSearchPerson,
    type SearchPerson,
} from '../../steps/probation-search/search-person'

const searchComponent = (page: Page) => page.frameLocator('#elasticsearch-frame')

const search = async (component: FrameLocator, term: string) => {
    // Results update as you type, so there is no Search button to click
    const input = component.locator('#search')
    await input.fill('')
    await input.fill(term)
}

const searchForResult = async (component: FrameLocator, term: string, result: Locator) => {
    await doUntil(
        () => search(component, term),
        () => expect(result).toBeVisible(),
        { timeout: 120_000 }
    )
}

test.beforeEach(async ({ page }) => {
    await deliusLogin(page)
    await page.getByRole('link', { name: /New Search/i }).click()
    await expect(searchComponent(page).locator('#search')).toBeVisible()
})

test.describe('with a test offender', () => {
    // default mode so that tests that need a CRN run with the same worker to reduce test times
    test.describe.configure({ mode: 'default' })

    let offender: SearchPerson | undefined
    let offenderCrn: string | undefined

    const currentOffender = () => {
        if (!offender) throw new Error('Search offender was not created for this test')
        return offender
    }

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage()
        try {
            offender = await createSearchPerson(page, crn => {
                offenderCrn = crn
            })
        } finally {
            await page.close()
        }
    })

    test.afterAll(async ({ browser }) => {
        const crn = offenderCrn
        offenderCrn = undefined
        offender = undefined
        if (crn) {
            const page = await browser.newPage()
            try {
                await removeSearchPerson(page, crn)
            } finally {
                await page.close()
            }
        }
    })

    const personLink = (component: FrameLocator) =>
        component.getByRole('link', { name: personSearchLinkName(currentOffender().person, 'last-first') })

    test('can search by person name', async ({ page }) => {
        const { person } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, `${person.firstName} ${person.lastName}`, personLink(component))
    })

    test('search is case insensitive (lower case)', async ({ page }) => {
        const { person } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, `${person.firstName} ${person.lastName}`.toLowerCase(), personLink(component))
    })

    test('search is case insensitive (upper case)', async ({ page }) => {
        const { person } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, `${person.firstName} ${person.lastName}`.toUpperCase(), personLink(component))
    })

    test('can search by CRN', async ({ page }) => {
        const { crn } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, crn, component.getByText(crn).first())
    })

    test('can search by date of birth', async ({ page }) => {
        const { dateOfBirth } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, dateOfBirth, personLink(component))
        await expect(component.getByText(dateOfBirth).first()).toBeVisible()
    })

    test('can search by telephone number', async ({ page }) => {
        const { mobileNumber } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, mobileNumber, personLink(component))
    })

    test('can search by postcode', async ({ page }) => {
        const { address } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, address.zipCode, personLink(component))
        await expect(component.getByText(address.zipCode).first()).toBeVisible()
    })

    test('can search using partial name', async ({ page }) => {
        const { person } = currentOffender()
        const component = searchComponent(page)
        // A partial name can match many people, so check the results match rather than a specific person
        const matchingResult = component
            .getByRole('link', { name: new RegExp(`\\b${escapeRegExp(person.lastName)}\\b`, 'i') })
            .first()
        await searchForResult(component, person.lastName, matchingResult)
    })

    test('highlights matching keyword in results', async ({ page }) => {
        const { address } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, address.zipCode, personLink(component))
        // Each search term is highlighted separately, e.g. "AB1" and "2CD"
        for (const term of address.zipCode.split(/\s+/)) {
            await expect(
                component
                    .locator('.highlighted-text')
                    .filter({ hasText: new RegExp(`^${escapeRegExp(term)}$`, 'i') })
                    .first()
            ).toBeVisible()
        }
    })

    test('shows search results count', async ({ page }) => {
        const { crn } = currentOffender()
        const component = searchComponent(page)
        await searchForResult(component, crn, component.getByText(/Showing \d+ to \d+ of \d+ results/))
    })
})

for (const { name, term } of [
    { name: 'does not search when search is empty', term: '' },
    { name: 'does not search for whitespace only', term: '      ' },
]) {
    test(name, async ({ page }) => {
        const component = searchComponent(page)
        await search(component, term)
        await expect(component.getByText(/Showing \d+ to \d+ of \d+ results/)).toBeHidden()
        await expect(component.locator('.view-offender-link')).toHaveCount(0)
    })
}

for (const { name, term } of noResultSearches) {
    test(name, async ({ page }) => {
        const component = searchComponent(page)
        await search(component, term)
        await expect(
            component.getByText('There are no results for your search. Try refining your query above.')
        ).toBeVisible()
        await expect(component.locator('.view-offender-link')).toHaveCount(0)
    })
}

test('can navigate search result pages', async ({ page }) => {
    const component = searchComponent(page)
    await search(component, searchData.placeWithManyResults)
    await expect(component.getByText(/Showing 1 to \d+ of \d+ results/)).toBeVisible()
    await component.getByRole('link', { name: 'Next page' }).click()
    await expect(component.getByText(/Showing 11 to \d+ of \d+ results/)).toBeVisible()
    await expect(component.locator('.view-offender-link').first()).toBeVisible()
})
