import type { Page } from '@playwright/test'
import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker/locale/en_GB'
import { buildAddress, createAddress, type Address } from '../delius/address/create-address'
import { login as deliusLogin } from '../delius/login'
import { createOffender } from '../delius/offender/create-offender'
import { deleteOffender } from '../delius/offender/delete-offender'
import { setMobileNumber } from '../delius/offender/update-offender'
import { deliusPerson, type Person } from '../delius/utils/person'

export interface SearchPerson {
    person: Person
    crn: string
    address: Address
    mobileNumber: string
    dateOfBirth: string
}

export const createSearchPerson = async (page: Page, onCreated: (crn: string) => void): Promise<SearchPerson> => {
    await deliusLogin(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    onCreated(crn)
    const address = buildAddress()
    const mobileNumber = `07700900${faker.number.int({ min: 4, max: 999 }).toString().padStart(3, '0')}`

    await createAddress(page, crn, address)
    await setMobileNumber(page, crn, mobileNumber)

    return {
        person,
        crn,
        address,
        mobileNumber,
        dateOfBirth: DateTime.fromJSDate(person.dob).toFormat('dd/MM/yyyy'),
    }
}

export const removeSearchPerson = async (page: Page, crn: string) => {
    await deliusLogin(page)
    await deleteOffender(page, crn)
}

export const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const personSearchLinkName = (person: Person, format: 'first-last' | 'last-first' = 'first-last') => {
    const name =
        format === 'first-last' ? `${person.firstName} ${person.lastName}` : `${person.lastName}, ${person.firstName}`
    return new RegExp(`^${escapeRegExp(name)}\\b`, 'i')
}
