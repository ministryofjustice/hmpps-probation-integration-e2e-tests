# Test info

- Name: Create and search for a person
- Location: /_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/tests/offender-events-and-delius/search-for-person.spec.ts:9:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

Locator: locator('#elasticsearch-frame').contentFrame().locator('.view-offender-link')
Expected string: "Pfeffer, Eduardo"
Received: <element(s) not found>
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for locator('#elasticsearch-frame').contentFrame().locator('.view-offender-link')


Call Log:
- Timeout 60000ms exceeded while waiting on the predicate
    at doUntil (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/delius/utils/refresh.ts:15:8)
    at /_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/tests/offender-events-and-delius/search-for-person.spec.ts:21:11
```

# Page snapshot

```yaml
- banner:
  - text: National Delius - TEST USE ONLY
  - list:
    - listitem:
      - link "Reviews":
        - /url: "#"
    - listitem:
      - link " Alerts 99+":
        - /url: "#"
    - listitem:
      - link " Print":
        - /url: "#"
    - listitem:
      - link " My Documents":
        - /url: "#"
    - listitem:
      - link " User Preferences":
        - /url: "#"
- complementary
- navigation:
  - list:
    - listitem:
      - link " Home":
        - /url: "#"
    - listitem:
      - link " National Search":
        - /url: "#"
    - listitem:
      - link "BETA  New Search":
        - /url: "#"
    - listitem:
      - link " National Custody Search":
        - /url: "#"
    - listitem:
      - link " Recently Viewed":
        - /url: "#"
    - listitem:
      - link " Case Management":
        - /url: "#"
    - listitem:
      - link " Officer Diary":
        - /url: "#"
    - listitem:
      - link " Court Diary":
        - /url: "#"
    - listitem:
      - link " Approved Premises Diary":
        - /url: "#"
    - listitem:
      - link " UPW Project Diary":
        - /url: "#"
    - listitem:
      - link " UPW Projects":
        - /url: "#"
    - listitem:
      - link " Data Maintenance":
        - /url: "#"
    - listitem:
      - link " Reference Data":
        - /url: "#"
    - listitem:
      - link " User Administration":
        - /url: "#"
    - listitem:
      - link " User Preferences":
        - /url: "#"
    - listitem:
      - link " Message Administration":
        - /url: "#"
    - listitem:
      - link " Sign Out":
        - /url: "#"
- main:
  - iframe
```

# Test source

```ts
   1 | import { expect, type Page } from '@playwright/test'
   2 |
   3 | export const refreshUntil = async (page: Page, expectation: () => Promise<void>, options?) => {
   4 |     await doUntil(async () => page.reload(), expectation, options)
   5 | }
   6 |
   7 | export const doUntil = async <T>(
   8 |     action: () => Promise<T>,
   9 |     expectation: () => Promise<void>,
  10 |     options: { timeout?: number; intervals?: number[] } = { timeout: 60_000, intervals: [250, 500, 1000, 5000] }
  11 | ) => {
  12 |     await expect(async () => {
  13 |         await action()
  14 |         return await expectation()
> 15 |     }).toPass(options)
     |        ^ Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)
  16 | }
  17 |
  18 | export const waitForJS = (page: Page, timeout = 0) => {
  19 |     const timeToWait = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))
  20 |     return page.evaluate(timeToWait, timeout)
  21 | }
  22 |
  23 | export const waitForAjax = async (page: Page): Promise<void> => {
  24 |     try {
  25 |         // wait up to 500ms for a request to start
  26 |         await expect(page.locator('.ajax-loading')).toBeAttached({ timeout: 500 })
  27 |     } catch {
  28 |         // no request fired - maybe the previous value didn't change, or this is not a dynamic field
  29 |     }
  30 |     // wait for request to finish
  31 |     await expect(page.locator('.ajax-loading')).not.toBeAttached()
  32 | }
  33 |
```