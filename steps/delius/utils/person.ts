import { faker, Sex, SexType } from '@faker-js/faker'

export interface Person {
    firstName: string
    lastName: string
    sex: string
    dob: Date
    pnc?: string
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
    return {
        firstName,
        lastName,
        sex: sex[0].toUpperCase() + sex.substring(1),
        dob,
        pnc,
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
