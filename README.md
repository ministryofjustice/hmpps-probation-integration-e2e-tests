# hmpps-end-to-end-tests
Playwright end to end tests. 

set up npm:

brew install npm
npm install

create .env file at the root of the project with the following values:
DELIUS_USERNAME=<delius_username>
DELIUS_PASSWORD=<delius_password>
DELIUS_URL=https://ndelius.test.probation.service.justice.gov.uk

run test:
npx playwright test tests/allocations/allocate-new-person.spec.ts --headed 

useful debug mode:
PWDEBUG=1 npx playwright test tests/allocations/allocate-new-person.spec.ts --headed 