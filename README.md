# hmpps-probation-integration-e2e-tests
Playwright end to end tests. 

set up npm:

`brew install npm` </br>
`npm install`

create .env file at the root of the project with the following values:</br></br>
```
DELIUS_URL=https://ndelius.test.probation.service.justice.gov.uk
DELIUS_USERNAME=<delius_username>
DELIUS_PASSWORD=<delius_password>

WORKFORCE_URL=https://workforce-management-dev.hmpps.service.justice.gov.uk

DPS_URL=https://digital-dev.prison.service.justice.gov.uk
DPS_USERNAME=<dps_username>
DPS_PASSWORD=<dps_password>

AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk

CRED_USERNAME=<client_id>
CRED_PASSWORD=<client_secret>

PRISON_API=https://api-dev.prison.service.justice.gov.uk/
```


run single test by name:</br>
` npx playwright test -g "Create a new case note" --headed`

run test file:</br>
`npx playwright test tests/allocations/allocate-new-person.spec.ts --headed` 

useful debug mode:</br>
`npx playwright test tests/allocations/allocate-new-person.spec.ts --debug`

