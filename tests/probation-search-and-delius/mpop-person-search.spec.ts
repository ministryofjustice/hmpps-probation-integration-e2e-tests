import { expect, test, type Locator, type Page } from '@playwright/test'
import { login as mpopLogin } from '../../steps/manage-a-supervision/login'
import { doUntil } from '../../steps/delius/utils/refresh'
import { noResultSearches, searchData } from '../../test-data/search-data'
import {
    createSearchPerson,
    escapeRegExp,
    personSearchLinkName,
    removeSearchPerson,
    type SearchPerson,
} from '../../steps/probation-search/search-person'

const resultLinks = (page: Page) => page.locator('.probation-search__results-container a[title^="Select case record"]')

const noResultsMessage = 'There are no results for your search. Try refining your query above.'

const search = async (page: Page, term: string) => {
    await page.getByLabel('Find a person on probation').fill(term)
    await page.getByRole('button', { name: 'Search', exact: true }).click()
}

const searchForResult = async (page: Page, term: string, result: Locator) => {
    await doUntil(
        () => search(page, term),
        () => expect(result).toBeVisible(),
        { timeout: 120_000 }
    )
}

test.beforeEach(async ({ page }) => {
    await mpopLogin(page)
    await page.getByRole('link', { name: 'Search' }).click()
    await expect(page.getByLabel('Find a person on probation')).toBeVisible()
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

    test('can search by person name', async ({ page }) => {
        const { person } = currentOffender()
        const result = page.getByRole('link', { name: personSearchLinkName(person, 'last-first') })
        await searchForResult(page, `${person.firstName} ${person.lastName}`, result)
    })

    test('search is case insensitive (lower case)', async ({ page }) => {
        const { person } = currentOffender()
        const result = page.getByRole('link', { name: personSearchLinkName(person, 'last-first') })
        await searchForResult(page, `${person.firstName} ${person.lastName}`.toLowerCase(), result)
    })

    test('search is case insensitive (upper case)', async ({ page }) => {
        const { person } = currentOffender()
        const result = page.getByRole('link', { name: personSearchLinkName(person, 'last-first') })
        await searchForResult(page, `${person.firstName} ${person.lastName}`.toUpperCase(), result)
    })

    test('can search by CRN', async ({ page }) => {
        const { crn } = currentOffender()
        await searchForResult(page, crn, page.getByRole('cell', { name: crn }).first())
    })

    test('can search by date of birth', async ({ page }) => {
        const { dateOfBirth, person } = currentOffender()
        await searchForResult(
            page,
            dateOfBirth,
            page.getByRole('link', { name: personSearchLinkName(person, 'last-first') })
        )
        await expect(page.locator('.probation-search__results-container').getByText(dateOfBirth).first()).toBeVisible()
    })

    test('can search by telephone number', async ({ page }) => {
        const { mobileNumber, person } = currentOffender()
        await searchForResult(
            page,
            mobileNumber,
            page.getByRole('link', { name: personSearchLinkName(person, 'last-first') })
        )
    })

    test('can search by postcode', async ({ page }) => {
        const { address, person } = currentOffender()
        await searchForResult(
            page,
            address.zipCode,
            page.getByRole('link', { name: personSearchLinkName(person, 'last-first') })
        )
        await expect(
            page.locator('.probation-search__results-container').getByText(address.zipCode).first()
        ).toBeVisible()
    })

    test('can search using partial name', async ({ page }) => {
        const { person } = currentOffender()
        // A partial name can match many people, so check the results match rather than a specific person
        const matchingResult = page
            .getByRole('link', { name: new RegExp(`\\b${escapeRegExp(person.lastName)}\\b`, 'i') })
            .first()
        await searchForResult(page, person.lastName, matchingResult)
    })

    test('highlights matching keyword in results', async ({ page }) => {
        const { address, person } = currentOffender()
        await searchForResult(
            page,
            address.zipCode,
            page.getByRole('link', { name: personSearchLinkName(person, 'last-first') })
        )
        // Each search term is highlighted separately, e.g. "AB1" and "2CD"
        for (const term of address.zipCode.split(/\s+/)) {
            await expect(
                page
                    .locator('.govuk-tag--yellow')
                    .filter({ hasText: new RegExp(`^${escapeRegExp(term)}$`, 'i') })
                    .first()
            ).toBeVisible()
        }
    })

    test('shows search results count', async ({ page }) => {
        const { crn } = currentOffender()
        await searchForResult(page, crn, page.getByText(/Showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+results/))
    })
})

for (const { name, term } of [
    { name: 'shows validation when search is empty', term: '' },
    { name: 'shows validation for whitespace only', term: '      ' },
]) {
    test(name, async ({ page }) => {
        await search(page, term)
        await expect(page.getByText(/enter a search term/i).first()).toBeVisible()
        await expect(resultLinks(page)).toHaveCount(0)
    })
}

for (const { name, term } of noResultSearches) {
    test(name, async ({ page }) => {
        await search(page, term)
        await expect(page.getByText(noResultsMessage)).toBeVisible()
        await expect(resultLinks(page)).toHaveCount(0)
    })
}

test('can navigate search result pages', async ({ page }) => {
    await search(page, searchData.placeWithManyResults)
    await expect(page.getByText(/Showing\s+1\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
    await page.getByRole('link', { name: 'Next page' }).click()
    await expect(page).toHaveURL(/[?&]page=2(&|$)/)
    await expect(page.getByText(/Showing\s+11\s+to\s+\d+\s+of\s+\d+\s+results/)).toBeVisible()
    await expect(resultLinks(page).first()).toBeVisible()
})
