export const searchData = {
    fullName: 'lilly nolan',
    resultName: 'Nolan, Lilly',
    resultName2: 'Grady, Christina',
    crn: 'X958738',
    dateOfBirth: '28/06/1985',
    telephoneNumber: '07123456789',
    postcode: 'NE9',
    partialName: 'Christina',
    place: 'Manchester',
    noMatch: 'ZZZZZZZZ12345',
    specialCharacters: '@#$%^&*',
}

export const nameSearches = [
    { name: 'can search by person name', term: searchData.fullName },
    { name: 'search is case insensitive (lower case)', term: searchData.fullName.toLowerCase() },
    { name: 'search is case insensitive (upper case)', term: searchData.fullName.toUpperCase() },
]

export const fieldSearches = [
    { name: 'can search by date of birth', term: searchData.dateOfBirth, expectedText: searchData.dateOfBirth },
    {
        name: 'can search by telephone number',
        term: searchData.telephoneNumber,
        expectedText: searchData.resultName2,
    },
    { name: 'can search by postcode', term: searchData.postcode, expectedText: searchData.postcode },
]

export const noResultSearches = [
    { name: 'shows no results message', term: searchData.noMatch },
    { name: 'handles special characters', term: searchData.specialCharacters },
]
