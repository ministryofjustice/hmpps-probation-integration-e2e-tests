import {faker, Gender} from "@faker-js/faker";

export const randomGender = () => {
    const genders = [Gender.male, Gender.female]
    return genders[Math.floor(Math.random() * genders.length)];
}

export interface Person {
    firstName: string
    lastName: string
    gender: string
    dob: Date
}

const genderOf = (genderStr: string) => {
    switch (genderStr) {
        case "Male" :
            return Gender.male
        case "Female":
            return Gender.female
    }
}

export const deliusPerson = (person?: Person) => {
    const gender = person?.gender ? genderOf(person.gender) : randomGender()
    const firstName = person?.firstName ? person.firstName : faker.name.firstName(gender)
    const lastName = person?.lastName ? person.lastName : faker.name.lastName(gender)
    const genderStr = gender.toString()
    const dob = faker.date.birthdate({min: 18, max: 70, mode: "age"})
    return {
        firstName,
        lastName,
        gender: genderStr[0].toUpperCase() + genderStr.substring(1),
        dob,
    }
}

export interface Practitioner{ firstName: string, lastName: string, providerName: string, teamName: string}

export interface Contact{relatesTo: string, type: string, officer: Practitioner, instance?: number }