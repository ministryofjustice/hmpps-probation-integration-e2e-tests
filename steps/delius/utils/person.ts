import { faker, Sex, SexType } from '@faker-js/faker'

export interface Person {
    firstName: string
    lastName: string
    sex: string
    dob: Date
    pnc?: string
    ethnicity?: string
    croNumber?: string
}

const sexOf = (str: string): SexType => {
    switch (str) {
        case 'Male':
            return Sex.Male
        case 'Female':
            return Sex.Female
    }
}

export const deliusPerson = (person?: Partial<Person>): Person => {
    const sex = person?.sex ? sexOf(person.sex) : faker.person.sexType()
    const firstName = person?.firstName ? person.firstName : faker.person.firstName(sex)
    const lastName = person?.lastName ? person.lastName : faker.person.lastName(sex)
    const dob = person?.dob || faker.date.birthdate({ min: 18, max: 69, mode: 'age' })
    const pnc = person?.pnc ? person.pnc : createPnc(dob)
    const ethnicity = person?.ethnicity ? person.ethnicity : "W1"
    const croNumber = person?.croNumber ? person.croNumber : createCroNumber()
    return {
        firstName,
        lastName,
        sex: sex[0].toUpperCase() + sex.substring(1),
        dob,
        pnc,
        ethnicity,
        croNumber
    }
}

export function createPnc(date: Date): string {
    const chars = 'ZABCDEFGHJKLMNPQRTUVWXY'
    const year = date.getFullYear().toString()
    const randomNumber = faker.number.int({ min: 0, max: 9999999 })
    const padded = randomNumber.toString().padStart(7, '0')
    const character = chars.charAt(+(year.substring(2) + padded) % 23)
    return year + '/' + padded + character
}

export function createCroNumber(): string {
    const chars = 'ZABCDEFGHJKLMNPQRTUVWXY'
    const year = faker.number.int({ min: 39, max: 95 }).toString()
    const randomNumber = faker.number.int({ min: 0, max: 9999999 })
    const padded = randomNumber.toString().padStart(7, '0')
    const character = chars.charAt(+(year.substring(2) + padded) % 23)
    return year + '/' + padded + character
}