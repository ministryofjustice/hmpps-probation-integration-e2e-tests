import { DateTime } from 'luxon'
import { v4 } from 'uuid'
import { Person } from '../delius/utils/person'
import { faker } from '@faker-js/faker'

export const SHEFFIELD_COURT = {
    code: 'B14LO',
    description: 'Sheffield Magistrates Court',
}

export const hearingData = (person: Person, courtCode: string = SHEFFIELD_COURT.code, caseId: string = v4()) => ({
    hearing: {
        id: v4(),
        hearingDays: [
            {
                listedDurationMinutes: 60,
                sittingDay: DateTime.now().toISO(),
            },
        ],
        type: {
            id: '5ae4c090-0f70-4694-b4fc-707633d2b430',
            description: 'Sentence',
        },
        courtCentre: {
            id: '9b583616-049b-30f9-a14f-028a53b7cfe8',
            code: courtCode,
            roomId: '7cb09222-49e1-3622-a5a6-ad253d2b3c39',
            roomName: '01',
        },
        jurisdictionType: 'MAGISTRATES',
        prosecutionCases: [
            {
                id: caseId,
                defendants: [
                    {
                        id: v4(),
                        pncId: person.pnc,
                        prosecutionCaseId: caseId,
                        personDefendant: {
                            personDetails: {
                                address: {
                                    address1: faker.location.streetAddress(),
                                    address2: faker.location.city(),
                                    address3: faker.location.county(),
                                    address5: faker.location.country(),
                                    postcode: faker.location.zipCode(),
                                },
                                contact: {
                                    email: faker.internet.exampleEmail(),
                                    home: faker.phone.number(),
                                    work: faker.phone.number(),
                                    mobile: faker.phone.number(),
                                },
                                dateOfBirth: DateTime.fromJSDate(person.dob).toISODate(), // Use Luxon to format date of birth
                                firstName: person.firstName,
                                gender: person.sex.toUpperCase(),
                                lastName: person.lastName,
                                title: person.sex.toUpperCase() === 'Male' ? 'Mr' : 'Ms',
                            },
                        },
                        offences: [
                            {
                                id: '0c932f0c-282b-418e-b294-8966498b1eef',
                                offenceLegislation:
                                    'Contrary to section 47 of the Offences Against the Person Act 1861.',
                                offenceTitle: 'Assault a person thereby occasioning them actual bodily harm',
                                wording:
                                    'On 25/11/2023 at Oxford,  you assaulted John Smith, thereby occasioning him, actual bodily harm',
                                listingNumber: 3,
                                offenceDefinitionId: 'a86115ce-b611-38e3-8300-1d3d653f5b3a',
                                offenceCode: 'OF61102',
                                plea: {
                                    pleaValue: 'not guilty',
                                },
                                verdict: {
                                    verdictType: {
                                        description: 'verdict',
                                    },
                                },
                                judicialResults: [
                                    {
                                        label: 'label',
                                        resultText: 'resultText',
                                        isConvictedResult: false,
                                        judicialResultTypeId: 'id',
                                    },
                                ],
                            },
                        ],
                    },
                ],
                initiationCode: 'C',
                prosecutionCaseIdentifier: {
                    prosecutionAuthorityCode: 'CPS',
                    prosecutionAuthorityId: '52b27284-0686-4894-b1c7-7d4b634cacdb',
                    caseURN: '25GD34377719',
                },
                caseMarkers: [{ markerTypeDescription: 'marker' }],
            },
        ],
    },
})
