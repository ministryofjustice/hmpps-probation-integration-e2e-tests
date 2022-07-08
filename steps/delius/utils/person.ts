import {faker, Gender} from "@faker-js/faker";

export const randomGender = () => {
    const genders = [Gender.male, Gender.female]
    return genders[Math.floor(Math.random() * genders.length)];
}

export interface Person {
    firstName: string,
    lastName: string
    gender: string
}

export const randomPerson: () => Person = () => {
    const gender = randomGender()
    const firstName = faker.name.firstName(gender)
    const lastName = faker.name.lastName(gender)
    return {
        firstName,
        lastName,
        gender: gender[0].toUpperCase() + gender.substring(1)
    }
}