# hmpps-end-to-end-tests
Playwright end to end tests. 

set up npm:

`brew install npm` </br>
`npm install`

create .env file at the root of the project with the following values:</br></br>
DELIUS_USERNAME=<delius_username></br>
DELIUS_PASSWORD=<delius_password></br>
DELIUS_URL=https://ndelius.test.probation.service.justice.gov.uk</br>
WORKFORCE_URL=https://workforce-management-dev.hmpps.service.justice.gov.uk</br>

run test:</br>
`npx playwright test tests/allocations/allocate-new-person.spec.ts --headed` 

useful debug mode:</br>
`npx playwright test tests/allocations/allocate-new-person.spec.ts --debug`

