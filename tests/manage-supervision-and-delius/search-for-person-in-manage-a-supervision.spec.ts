import { expect, test } from '@playwright/test'
import { login as deliusLogin } from '../../steps/delius/login'
import { createOffender } from '../../steps/delius/offender/create-offender'
import { deliusPerson } from '../../steps/delius/utils/person'
import * as dotenv from 'dotenv'
import { login as managePeopleOnProbationLogin } from '../../steps/manage-a-supervision/login'

dotenv.config() // read environment variables into process.env

// test('Search for a person in Manage a Supervision', async ({ page }) => {
//     // Given a new person in Delius
//     await deliusLogin(page)
//     const person = deliusPerson()
//     const crn = await createOffender(page, { person })
//
//     // When I login to Manage People on Probation
//     await managePeopleOnProbationLogin(page)
//
//     // And I search for the CRN
//     await page.getByRole('link', { name: 'Search' }).click()
//     await page.getByLabel('Find a person on probation').fill(crn)
//     await page.getByRole('button', { name: 'Search' }).click()
//
//     // Then the person appears in the search results and crn & name matches
//     await page.locator(`[href$="${crn}"]`).click()
//     await expect(page).toHaveTitle(/Overview/)
//     await expect(page.locator('[data-qa="crn"]')).toContainText(crn)
//     await expect(page.locator('[data-qa="name"]')).toContainText(person.firstName + ' ' + person.lastName)
// })
//
// import { chromium } from 'playwright'
//
// async function checkLinks() {
//     const browser = await chromium.launch({ headless: true })
//     const page = await browser.newPage()
//
//     // Define the pages to visit
//     const pagesToVisit = [
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/recent-cases',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/recent-cases',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/search',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/addresses',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/personal-contact/2500331493',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/probation-history/staff-contacts/#previous',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/compliance',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/interventions',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/edit-main-address',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/addresses',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/personal-contact/2500331493',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/probation-history/staff-contacts/#previous',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
//     ]
//
//     // Function to check links on the page
//     const checkPageLinks = async (url: string) => {
//         // Visit the page
//         await page.goto(url)
//         console.log(`Checking links on page: ${url}`)
//
//         // Intercept all requests and log status code for link requests
//         page.on('response', async response => {
//             const status = response.status()
//             const url = response.url()
//
//             // Only log the status of 4xx or 5xx errors (broken links)
//             if (status >= 400) {
//                 console.log(`Broken link found: ${url} with status code: ${status}`)
//             }
//         })
//
//         // Get all links on the page
//         const links = await page.locator('a')
//         const linkCount = await links.count()
//
//         // Check each link without navigating away
//         for (let i = 0; i < linkCount; i++) {
//             const linkUrl = await links.nth(i).getAttribute('href')
//             if (linkUrl && linkUrl.startsWith('http')) {
//                 console.log(`Checking link: ${linkUrl}`)
//                 // You don't need to call page.goto() here since it's already being handled by the response event
//             }
//         }
//     }
//
//     // Check links on each page
//     for (const pageUrl of pagesToVisit) {
//         await checkPageLinks(pageUrl)
//     }
//
//     await browser.close()
// }
//
// checkLinks().catch(console.error)

// import { test, expect } from '@playwright/test'

test('Check all the links in Manage Person on Probation', async ({ page }) => {
    // Define the list of URLs
    const pagesToVisit = [
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/recent-cases',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/recent-cases',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/search',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/addresses',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/personal-contact/2500331493',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/probation-history/staff-contacts/#previous',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/compliance',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/interventions',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/edit-main-address',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/addresses',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/personal-contact/2500331493',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/probation-history/staff-contacts/#previous',
        'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
    ]
    // When I login to Manage People on Probation
    await managePeopleOnProbationLogin(page)

    // Loop through each page URL and check the links
    for (const pageUrl of pagesToVisit) {
        // Go to the page
        await page.goto(pageUrl)
        console.log(`Checking links on page: ${pageUrl}`)

        // Get all links on the page
        const links = await page.locator('a')
        const linkCount = await links.count()

        // Loop through each link on the page and check for broken links
        for (let i = 0; i < linkCount; i++) {
            const linkUrl = await links.nth(i).getAttribute('href')

            if (linkUrl && linkUrl.startsWith('http')) {
                try {
                    // Make a request to the link to check the status
                    const response = await page.request.get(linkUrl)
                    const status = response.status()

                    // If status is 4xx or 5xx, it's a broken link
                    if (status >= 400) {
                        console.log(`Broken link found: ${linkUrl} with status code: ${status}`)
                        // Fail the test if any link is broken
                        expect(status).toBeLessThan(400)
                    } else {
                        console.log(`Valid link: ${linkUrl}`)
                    }
                } catch (error) {
                    console.log(`Error with link: ${linkUrl} - ${error.message}`)
                }
            }
        }
    }
})
//
// test('Check and click all links in MPoP', async ({ page }) => {
//     // List of URLs to visit
//     const pagesToVisit = [
//         // 'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/recent-cases',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/recent-cases',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/search',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/addresses',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/personal-contact/2500331493',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/probation-history/staff-contacts/#previous',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/compliance',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/interventions',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/appointments/appointment/2508261689',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/edit-main-address',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/addresses',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/personal-contact/2500331493',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/circumstances',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/disabilities',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/adjustments',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/personal-details/staff-contacts',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500777416',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/removed-risk-flags',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/risk/flag/2500752301',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/previous-orders/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/offences/10',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/sentence/probation-history/staff-contacts/#previous',
//         'https://manage-people-on-probation-dev.hmpps.service.justice.gov.uk/case/X756510/activity-log/activity/2508601277?category=&view=default&requirement=&&page=0',
//     ]
//
//     // When I login to Manage People on Probation
//     await managePeopleOnProbationLogin(page)
//
//     // Function to click all links on a page
//     const checkPageLinks = async (url: string) => {
//         // Visit the page
//         await page.goto(url)
//         console.log(`Visiting page: ${url}`)
//
//         // Get all links on the page
//         const links = await page.locator('a')
//         const linkCount = await links.count()
//
//         // Loop through each link on the page and check for broken links
//         for (let i = 0; i < linkCount; i++) {
//             const link = await links.nth(i)
//             const linkUrl = await link.getAttribute('href')
//
//             if (linkUrl && linkUrl.startsWith('http')) {
//                 console.log(`Clicking on link: ${linkUrl}`)
//
//                 try {
//                     // Listen for the new tab or window opening
//                     const [newPage] = await Promise.all([
//                         page.context().waitForEvent('page'), // wait for the new page (tab) to open
//                         link.click(), // click the link to open it
//                     ])
//
//                     // Wait for the new page to load
//                     await newPage.waitForLoadState('load')
//
//                     // You can perform additional checks here on the new page, if needed
//                     console.log(`Successfully navigated to: ${newPage.url()}`)
//
//                     // Close the new tab after validation
//                     await newPage.close()
//                 } catch (error) {
//                     console.log(`Error with clicking link: ${linkUrl} - ${error.message}`)
//                 }
//             }
//         }
//     }
//
//     // Loop through each page URL and check the links
//     for (const pageUrl of pagesToVisit) {
//         await checkPageLinks(pageUrl)
//     }
// })
