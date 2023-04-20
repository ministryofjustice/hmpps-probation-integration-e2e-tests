# Probation Integration End-to-end Tests

End-to-end tests
for [Probation Integration Services](https://github.com/ministryofjustice/hmpps-probation-integration-services),
written in TypeScript using [Playwright](https://playwright.dev).

These tests are designed to exercise real services in test and pre-production environments.
Testing against real services is particularly useful for highlighting integration issues with authentication, message
queues, external databases etc. - components we can't reliably test using mocks.

## Prerequisites

### Dependencies

```shell
# install node and npm (Mac/Linux)
brew install npm

# install project dependencies
npm install

# install browsers
npx playwright install --with-deps
```

> [Node](https://nodejs.org/en/) 16.x or higher is required.
Install the latest version with `brew install npm`, or a specific version with `brew install node@16`.

### Configuration

Create a `.env` file at the root of the project with the following values:

```
ENV=test

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

REFERANDMONITOR_URL=https://hmpps-interventions-ui-dev.apps.live-1.cloud-platform.service.justice.gov.uk
REFERANDMONITOR_SUPPLIER_USERNAME=<r&m_supplier_username>
REFERANDMONITOR_SUPPLIER_PASSWORD=<r&m_supplier_password>

OASYS_URL=https://ords.t2.oasys.service.justice.gov.uk/
OASYS_USERNAME_TIMELINE=<oasys_t2_timeline_username>
OASYS_PASSWORD_TIMELINE=<oasys_t2_timeline_password>

OASYS_USERNAME_BOOKING=<oasys_t2_booking_username>
OASYS_PASSWORD_BOOKING=<oasys_t2_booking_username>

OASYS_USERNAME_RSR=<oasys_t2_rsr_username>
OASYS_PASSWORD_RSR=<oasys_t2_rsr_username>

APPROVEDPREMISES_URL=https://approved-premises-dev.hmpps.service.justice.gov.uk/

```

## Running Tests

To run all the tests,

```shell
npx playwright test
```

Or to run a subset of tests,

```shell
# by directory
npx playwright test workforce-allocations-to-delius

# by filename
npx playwright test allocate-new-person

# or by test name (-g)
npx playwright test -g 'Allocate previously-managed person'
```

### Debugging

Add the `--headed` option to see the tests running in a browser, or add the `--debug` option to manually step through
each test,

```shell
npx playwright test --headed # watch the test run in your browser
npx playwright test --debug  # step through the test run manually
```

[Tracing](https://playwright.dev/docs/trace-viewer) is enabled by default.
Once your tests have finished running, access the trace viewer by clicking the link at the bottom of the HTML report.
The trace viewer displays a visual timeline of events you can step through to inspect what happened.

## Code Formatting

[ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) are used for linting and formatting.
To fix any issues, run

```shell
npx eslint . --fix
```

Enable the ESLint "fix on save" setting in IntelliJ to fix any formatting issues before committing.
See [Fix problems automatically on save](https://www.jetbrains.com/help/idea/eslint.html#ws_eslint_configure_run_eslint_on_save)

A GitHub Action will fix any missed formatting issues for you when creating a pull request.

## Test Data

Each test scenario generally creates its own data (e.g. people, events/sentences, contacts), using the Delius UI or
Prison API.
However, the tests also rely on pre-existing "reference data".
This reference data is captured in the [test-data](./test-data) directory, and referenced throughout the tests using
the `data` object.

For example,

```typescript
// === test-data/environments/common.ts ===

export const commonData: TestData = {
    events: {
        custodial: {
            appearanceType: "Sentence",
            outcome: "Adult Custody < 12m"
        }
    }
}


// === tests/my-test.spec.ts ===

import { data } from "../../test-data/test-data.js";

test("Create a custodial event", async ({ page }) => {
    await createEvent(page, { event: data.events.custodial })
})
```

### Environments

Each test scenario is designed to run in both the Test and Pre-production environments, which may have slight
differences in reference data.
For this reason, there are three data files:

* [test-data/environments/common.ts](test-data/environments/common.ts) contains static / well-known data that is the
  same across all environments
* [test-data/environments/test.ts](test-data/environments/test.ts) contains data that only exists in the Test
  environment
* [test-data/environments/pre-prod.ts](test-data/environments/test.ts) contains data that only exists in the
  Pre-production environment

Use the `ENV` variable in your `.env` file to specify which set of data to use.
Valid values are `test` or `pre-prod`.

# Support

For any issues or questions, please contact the Probation Integration team via
the [#probation-integration-tech](https://mojdt.slack.com/archives/C02HQ4M2YQN)
Slack channel. Or feel free to create
a [new issue](https://github.com/ministryofjustice/hmpps-probation-integration-services/issues/new)
in this repository.
