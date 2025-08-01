# Probation Integration End-to-end Tests

End-to-end tests
for [Probation Integration Services](https://github.com/ministryofjustice/hmpps-probation-integration-services),
written in TypeScript using [Playwright](https://playwright.dev).

These tests are designed to exercise real services in test and pre-production environments.
Testing against real services is particularly useful for highlighting integration issues with authentication, message
queues, external databases etc. - components we can't reliably test using mocks.

## Getting Started

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

Credentials and URLs are configured using a `.env` file at the root of the project.

If you have access to the Probation Integration 1Password Vault, you can use the `.env.1password` file by prefixing any npm commands with `op run --account ministryofjustice.1password.eu --env-file=./.env.1password`

For example,
```shell
op run --account ministryofjustice.1password.eu --env-file=./.env.1password -- npx playwright test
```

See https://developer.1password.com/docs/cli/secrets-environment-variables#use-environment-env-files

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

import { data } from "../../test-data/test-data";

test("Create a custodial event", async ({ page }) => {
    await createEvent(page, { event: data.events.custodial })
})
```

### Environments

Each test scenario is currently designed to run in the Test environment only.

* [test-data/environments/common.ts](test-data/environments/common.ts) contains static / well-known data that is the
  same across all environments
* [test-data/environments/test.ts](test-data/environments/test.ts) contains data that only exists in the Test
  environment

Use the `ENV` variable in your `.env` file to specify which set of data to use.
Currently, `test` is the only valid value.

### Data Creation
Playwright tests can also be useful for setting up data in systems where APIs aren't available.

Data creation scripts can be found in the [test-data-setup](./test-data-setup) directory. 
To run them, set the `TEST_DIR` environment variable:

```shell
TEST_DIR=./test-data-setup npx playwright test
```

## Pipeline
This repository includes a re-usable GitHub Actions workflow to help you run the end-to-end tests in your own pipeline.
Running end-to-end tests in your own pipeline is a great way to verify that your changes haven't broken integrations with other services, before deploying to production.

Example usage:
```yaml
  build:
    ...
  deploy-to-dev:
    ...

  end-to-end-tests:
    name: Run end-to-end tests
    uses: ministryofjustice/hmpps-probation-integration-e2e-tests/.github/workflows/test-remote.yml@main
    needs: deploy-to-dev
    with:
      projects: '["tier-to-delius"]' # A JSON array of integrations you want to test
    secrets:
      token: ${{ secrets.BOT_GITHUB_TOKEN }} # A personal access token with "actions:write" permissions on the hmpps-probation-integration-e2e-tests repository

  deploy-to-prod:
    needs: end-to-end-tests
    ...

```


## Support

For any issues or questions, please contact the Probation Integration team via
the [#probation-integration-tech](https://mojdt.slack.com/archives/C02HQ4M2YQN)
Slack channel. Or feel free to create
a [new issue](https://github.com/ministryofjustice/hmpps-probation-integration-e2e-tests/issues/new)
in this repository.
