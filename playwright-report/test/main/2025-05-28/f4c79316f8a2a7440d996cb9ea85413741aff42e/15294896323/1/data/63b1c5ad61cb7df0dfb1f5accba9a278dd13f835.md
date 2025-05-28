# Test info

- Name: View case in Create and Vary a Licence
- Location: /_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/tests/create-and-vary-a-licence-and-delius/view-case.spec.ts:17:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)

Locator: locator(':root')
Expected pattern: /HMPPS Digital Services - Sign in/
Received string:  "503 Service Temporarily Unavailable"
Call log:
  - expect.toHaveTitle with timeout 5000ms
  - waiting for locator(':root')
    8 × locator resolved to <html>…</html>
      - unexpected value "503 Service Temporarily Unavailable"

    at login (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/cvl-licences/login.ts:5:24)
    at createLicence (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/cvl-licences/application.ts:6:5)
    at /_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/tests/create-and-vary-a-licence-and-delius/view-case.spec.ts:29:5
```

# Page snapshot

```yaml
- heading "503 Service Temporarily Unavailable" [level=1]
- separator
- text: nginx
```

# Test source

```ts
   1 | import { type Page, expect } from '@playwright/test'
   2 |
   3 | export const login = async (page: Page) => {
   4 |     await page.goto(process.env.CVL_URL)
>  5 |     await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
     |                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)
   6 |     await page.fill('#username', process.env.DELIUS_USERNAME!)
   7 |     await page.fill('#password', process.env.DELIUS_PASSWORD!)
   8 |     await page.click('#submit')
   9 |     await expect(page).toHaveTitle(/Create and vary a licence - Home/)
  10 | }
  11 |
  12 | export const loginAsPrisonOfficer = async (page: Page) => {
  13 |     await page.goto(process.env.CVL_URL)
  14 |     await expect(page).toHaveTitle(/HMPPS Digital Services - Sign in/)
  15 |     await page.fill('#username', process.env.DPS_USERNAME!)
  16 |     await page.fill('#password', process.env.DPS_PASSWORD!)
  17 |     await page.click('#submit')
  18 |     await expect(page).toHaveTitle(/Create and vary a licence - Home/)
  19 | }
  20 |
```