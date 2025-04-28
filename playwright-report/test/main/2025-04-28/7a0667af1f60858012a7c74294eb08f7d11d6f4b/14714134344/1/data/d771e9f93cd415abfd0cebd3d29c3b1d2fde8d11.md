# Test info

- Name: Make a Management Oversight Decision and verify in Delius
- Location: /_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/tests/make-recall-decisions-and-delius/recommend-a-recall.spec.ts:28:1

# Error details

```
TimeoutError: page.selectOption: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('#licenceSubCategory\\:selectOneMenu')
    - locator resolved to <select size="1" class="form-select" id="licenceSubCategory:selectOneMenu" name="licenceSubCategory:selectOneMenu">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    10 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms

    at selectOption (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs.ts:32:20)
    at selectOption (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs.ts:38:20)
    at selectOption (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs.ts:38:20)
    at selectOption (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/delius/utils/inputs.ts:38:20)
    at createLicenceCondition (/_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/steps/delius/licence-condition/create-licence-condition.ts:15:5)
    at /_work/hmpps-probation-integration-e2e-tests/hmpps-probation-integration-e2e-tests/tests/make-recall-decisions-and-delius/recommend-a-recall.spec.ts:58:30
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
- complementary:
  - text: "CRN:"
  - link "X900936":
    - /url: "#"
  - text: "PNC: 2006/6965758R Name:"
  - link "Angel Dietrich":
    - /url: "#"
  - text: "(Male) D.O.B: 21/06/2006 (18) Community Manager: (RO)"
  - link "Unallocated":
    - /url: "#"
  - text: "- Unallocated Team(N02), NPS North East Prison Manager:"
  - link "Unallocated":
    - /url: "#"
  - text: "- All Staff,"
  - link "Unallocated":
    - /url: "#"
  - text: "Tier:"
  - link "D_0":
    - /url: "#"
  - text: " Event: 1. Adult Custody < 12m (6 Months) for Stealing pedal cycles Expected Sentence End Date: 26/10/2025 Order Manager: Unallocated - OMU A , NPS North East Released - On Licence: 27/04/2025"
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
      - list:
        - listitem:
          - link "Case Summary":
            - /url: "#"
        - listitem:
          - link "Personal Details":
            - /url: "#"
          - list
        - listitem:
          - link "Drugs":
            - /url: "#"
        - listitem:
          - link "Event List":
            - /url: "#"
          - list:
            - listitem:
              - link "Additional Offences":
                - /url: "#"
            - listitem:
              - link "Additional Sentences":
                - /url: "#"
            - listitem:
              - link "Approved Premises Referrals":
                - /url: "#"
            - listitem:
              - link "Case Allocation":
                - /url: "#"
            - listitem:
              - link "Cohort":
                - /url: "#"
            - listitem:
              - link "Concurrent/Consecutive":
                - /url: "#"
            - listitem:
              - link "Contact Extract":
                - /url: "#"
            - listitem:
              - link "Court Appearances":
                - /url: "#"
            - listitem:
              - link "Court & Institutional Reports":
                - /url: "#"
            - listitem:
              - link "Event Details":
                - /url: "#"
            - listitem:
              - link "Licence Conditions":
                - /url: "#"
            - listitem:
              - link "NSIs":
                - /url: "#"
            - listitem:
              - link "OASys Assessments":
                - /url: "#"
            - listitem:
              - link "OGRS Calculation":
                - /url: "#"
            - listitem:
              - link "Order Supervisor History":
                - /url: "#"
            - listitem:
              - link "Referrals":
                - /url: "#"
            - listitem:
              - link "Supervision Requirements":
                - /url: "#"
            - listitem:
              - link "Terminate Event":
                - /url: "#"
            - listitem:
              - link "Throughcare":
                - /url: "#"
            - listitem:
              - link "Tier Allocation":
                - /url: "#"
        - listitem:
          - link "Contact List":
            - /url: "#"
        - listitem:
          - link "Document List":
            - /url: "#"
        - listitem:
          - link "Subject Access Reports":
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
  - heading "Add Licence Conditions" [level=1]
  - heading "Add Licence Condition" [level=2]
  - text: Licence Condition:*
  - combobox "Licence Condition:*":
    - option "[Please Select]"
    - option "Curfew (Police Checks Only)" [selected]
    - option "Disclosure of information"
    - option "Drug Testing Condition"
    - option "Freedom of movement"
    - option "LP Licence Condition"
    - option "Licence - Accredited Programme"
    - option "Licence - Prohibited Contact"
    - option "Making or maintaining contact with a person"
    - option "Participate or co-op with Programme or Activities"
    - option "Polygraph Condition"
    - option "Poss, own, control, inspect specified items /docs"
    - option "Residence at a specific place"
    - option "Restriction of residency."
    - option "Supervision in the community"
  - text: "Licence Condition Subtype:"
  - combobox "Licence Condition Subtype:":
    - option "[Please Select]" [selected]
    - option "Confine yourself to an address approved by your supervising officer between the hours daily unless otherwise authorised by your supervising officer."
  - text: Imposed (Release) Date:*
  - button ""
  - textbox "Imposed (Release) Date:*": 27/04/2025
  - text: "Expected Start Date:"
  - button ""
  - textbox "Expected Start Date:"
  - text: "Actual Start Date:"
  - button ""
  - textbox "Actual Start Date:"
  - text: Provider:*
  - combobox "Provider:*":
    - option "[Please Select]"
    - option "East Midlands Region"
    - option "East of England"
    - option "Greater Manchester"
    - option "Kent Surrey Sussex Region"
    - option "London"
    - option "North East Region"
    - option "North West Region" [selected]
    - option "NPS Midlands"
    - option "NPS North East"
    - option "NPS North West"
    - option "South Central"
    - option "South West"
    - option "Wales"
    - option "West Midlands Region"
    - option "Yorkshire and The Humber"
  - text: "Team:"
  - combobox "Team:":
    - option "[Please Select]" [selected]
    - option "A P Central Admissions Unit"
    - option "Adelaide House Approved Premises"
    - option "All Cheshire (Team Unknown)"
    - option "All Cumbria (Team Unknown)"
    - option "All Knowsley St Helens Wirral (Team Unknown)"
    - option "All Lancashire NW (Team Unknown)"
    - option "All Lancashire SE (Team Unknown)"
    - option "All Liverpool & Sefton (Team Unknown)"
    - option "Automated Allocation Team"
    - option "Barrow Court"
    - option "Blackpool OMU A - NPS"
    - option "Blackpool OMU B - NPS"
    - option "Blackpool OMU C - NPS"
    - option "Blackpool OMU D - NPS"
    - option "Bowling Green Approved Premises"
    - option "Bunbury House Approved Premises"
    - option "Carlisle Court"
    - option "Cheshire PICS - OPD Project."
    - option "Chester Crown Court"
    - option "Chester Magistrates Court"
    - option "Chester NPS OMU"
    - option "Chorley - NPS"
    - option "Contact Only Liverpool & Sefton NPS"
    - option "CPDI Community Specification in Cumbria"
    - option "CRC Breach Report Requests"
    - option "CRC Court Work Requests"
    - option "CRC Created"
    - option "CRC Created NSIs"
    - option "CRC Risk Reviews"
    - option "Crewe Magistrates Court"
    - option "Crewe NPS OMU"
    - option "Crown Court Liaison"
    - option "Default Designated Transfer Team"
    - option "Div HUB NW"
    - option "East Lancashire Court & Assessment Team"
    - option "Edith Rigby House Approved Premises"
    - option "From YYY in N01"
    - option "From ZZZ in N01"
    - option "Halton NPS OMU"
    - option "Haworth House Approved Premises"
    - option "Highfield House Approved Premises"
    - option "HMP Altcourse"
    - option "HMP Hindley"
    - option "HMP Kennet"
    - option "HMP Kirkham"
    - option "HMP Lancaster Farms (YOI & RC)"
    - option "HMP Liverpool"
    - option "HMP Risley"
    - option "HMP Styal"
    - option "HMYOI Thorn Cross"
    - option "Homelessness Prevention Team,"
    - option "IAPS Team(N50)"
    - option "Inactive Team(N51)"
    - option "Insight - PD Project"
    - option "Insight IIRMS"
    - option "Kendal Court"
    - option "Lancashire MAPPA - NPS"
    - option "Lancashire NW Court and Assessment Team"
    - option "Lancashire PICS"
    - option "Lancashire Programmes Team - NPS"
    - option "Lancaster - NPS"
    - option "Linden Bank Approved Premises"
    - option "Macclesfield Magistrates Court"
    - option "Macclesfield NPS OMU"
    - option "MAPPA and TACT Resource Unit"
    - option "Merseybank Approved Premises"
    - option "Merseyside SO IOM"
    - option "NLPC Offender Management 1"
    - option "North Cheshire Magistrates Court"
    - option "North Liverpool Complex Case Court"
    - option "Northwich NPS OMU"
    - option "NPS - Barrow 1"
    - option "NPS - Blackburn 1"
    - option "NPS - Blackburn 2"
    - option "NPS - Burnley 1"
    - option "NPS - Burnley 2"
    - option "NPS - Carlisle 1"
    - option "NPS - Courts SDU - Courts Crown"
    - option "NPS - Courts SDU - Courts Sefton"
    - option "NPS - Courts SDU - Courts Wirral"
    - option "NPS - Courts SDU - Liverpool Mags"
    - option "NPS - Kendal 1"
    - option "NPS - Knowsley SDU - POD 1"
    - option "NPS - Knowsley SDU - POD 2"
    - option "NPS - Knowsley SDU - POD 3"
    - option "NPS - Knowsley SDU - POD 4"
    - option "NPS - Knowsley SDU - Unallocated"
    - option "NPS - Knowsley SDU - Womens POD"
    - option "NPS - Knowsley SDU - YOS"
    - option "NPS - North Liverpool SDU - IOM POD"
    - option "NPS - North Liverpool SDU - POD 1"
    - option "NPS - North Liverpool SDU - POD 2"
    - option "NPS - North Liverpool SDU - POD 3"
    - option "NPS - North Liverpool SDU - POD 4"
    - option "NPS - North Liverpool SDU - POD 5"
    - option "NPS - North Liverpool SDU - POD 6"
    - option "NPS - North Liverpool SDU - POD 7"
    - option "NPS - North Liverpool SDU - Unallocated"
    - option "NPS - NW Extremist Unit"
    - option "NPS - Penrith 1"
    - option "NPS - Sefton SDU - IOM POD"
    - option "NPS - Sefton SDU - POD 1"
    - option "NPS - Sefton SDU - POD 2"
    - option "NPS - Sefton SDU - POD 3"
    - option "NPS - Sefton SDU - POD 4"
    - option "NPS - Sefton SDU - Unallocated"
    - option "NPS - South Liverpool SDU - POD 1"
    - option "NPS - South Liverpool SDU - POD 2"
    - option "NPS - South Liverpool SDU - POD 3"
    - option "NPS - South Liverpool SDU - POD 4"
    - option "NPS - South Liverpool SDU - POD 5"
    - option "NPS - South Liverpool SDU - POD 6 PPO"
    - option "NPS - South Liverpool SDU - Unallocated"
    - option "NPS - St Helens SDU - POD 1"
    - option "NPS - St Helens SDU - POD 2"
    - option "NPS - St Helens SDU - Unallocated"
    - option "NPS - Victims Team"
    - option "NPS - Wirral SDU - Learning & Development"
    - option "NPS - Wirral SDU - Management"
    - option "NPS - Wirral SDU - POD 1"
    - option "NPS - Wirral SDU - POD 2"
    - option "NPS - Wirral SDU - POD 3"
    - option "NPS - Wirral SDU - POD 4"
    - option "NPS - Wirral SDU - POD 5"
    - option "NPS - Wirral SDU - POD 6"
    - option "NPS - Wirral SDU - Unallocated"
    - option "NPS - Wirral SDU - YOS"
    - option "NPS - Workington 1"
    - option "NPS Merseyside Resettle"
    - option "NW Enforcement Hub Crown"
    - option "NW Enforcement Hub Mags"
    - option "NW SFO Team"
    - option "OMIC Chester NPS OMU"
    - option "OMIC Chorley - NPS"
    - option "OMIC Crewe NPS OMU"
    - option "OMIC Halton NPS OMU"
    - option "OMIC Lancaster - NPS"
    - option "OMIC Macclesfield NPS OMU"
    - option "OMIC NPS - Barrow 1"
    - option "OMIC NPS - Blackburn 1"
    - option "OMIC NPS - Burnley 1"
    - option "OMIC NPS - Carlisle 1"
    - option "OMIC NPS - Kendal 1"
    - option "OMIC NPS - Knowsley SDU"
    - option "OMIC NPS - North Liverpool SDU - Unallocated"
    - option "OMIC NPS - Penrith 1"
    - option "OMIC NPS - Sefton SDU - Unallocated"
    - option "OMIC NPS - South Liverpool SDU - Unallocated"
    - option "OMIC NPS - St Helens SDU - Unallocated"
    - option "OMIC NPS - Wirral SDU - Unallocated"
    - option "OMIC NPS - Workington 1"
    - option "OMIC NPS Blackpool"
    - option "OMiC NW Lancs"
    - option "OMIC POM Responsibility"
    - option "OMIC Preston 1 - NPS"
    - option "OMIC Skelmersdale - NPS"
    - option "OMIC Warrington NPS OMU"
    - option "OMIC Winsford NPS OMU"
    - option "Other Third Party EM Supervision"
    - option "Out of Area Report Requests"
    - option "Performance & Quality Unit"
    - option "PICS - OPD Projects"
    - option "Practice Development Courts"
    - option "Practice Development FNO"
    - option "Practice Development Public Protection"
    - option "Preston 1 - NPS"
    - option "Preston 2 - NPS"
    - option "Preston 3 - NPS"
    - option "PTA Team"
    - option "Rehabilitation"
    - option "Risk and Audit Team"
    - option "Serious Organised Crime Unit (SOCU) NW"
    - option "Sex Offender Programmes Team 1"
    - option "Sex Offender Programmes Team 2"
    - option "Sex Offender Programmes Team 3"
    - option "Sex Offender Programmes Team 4"
    - option "Skelmersdale - NPS"
    - option "Southwood Approved Premises"
    - option "Stafford House Approved Premises"
    - option "Tiering Service"
    - option "Training Team"
    - option "Unallocated Team(N51)"
    - option "UPW Enforcement"
    - option "Warrington Combined Crown Court"
    - option "Warrington Magistrates Court"
    - option "Warrington NPS OMU"
    - option "Workington Court"
    - option "ZZ_Awaiting Reassignment"
    - option "ZZ_Awaiting_Allocation"
  - text: "Officer:"
  - combobox "Officer:":
    - option "[Please Select]" [selected]
  - text: "Notes:"
  - textbox "Notes:"
  - link " Spell Check":
    - /url: "#"
  - text: "0/4000 Expected End Date:"
  - button ""
  - textbox "Expected End Date:"
  - text: "Actual End Date:"
  - button ""
  - textbox "Actual End Date:"
  - text: "Termination Reason:"
  - combobox "Termination Reason:":
    - option "[Please Select]" [selected]
    - option "Consec/ Concurrent Order imposed"
    - option "Duplicate Person Record"
    - option "Expired (Breach/Recall)"
    - option "Licence Condition Completed"
    - option "Licence Condition not started"
    - option "Licence Conditions Varied"
    - option "Not activated on release from custody"
    - option "Not Supervised"
    - option "On Appeal"
    - option "Person on Probation Deported or Removed"
    - option "Person on Probation Died"
    - option "Programme Specified by OM"
    - option "Programme Varied by OM"
    - option "Revoked (Failure to Comply)"
    - option "Revoked (FTC on other Req)"
    - option "Revoked (Further Offence - no recall)"
    - option "Revoked (suspension of supervision)"
    - option "Revoked (unworkable)"
    - option "Transferred outside of UK jurisdiction"
    - option "Transferred to Northern Ireland"
    - option "Transferred to Scotland"
  - button "Add"
  - heading "Licence Conditions List" [level=2]
  - text: No Licence Conditions added. Use the form to add Licence Conditions to this Event.
  - button "Cancel"
```

# Test source

```ts
   1 | import { type Page } from '@playwright/test'
   2 | import { DeliusDateFormatter, DeliusTimeFormatter, OasysDateFormatter } from './date-time'
   3 | import { waitForAjax } from './refresh'
   4 |
   5 | const getOptions = async (page: Page, selector: string, filter: (s: string) => boolean = null) => {
   6 |     return (await page.$$eval(`${selector} > option`, opts => opts.map(option => option.textContent)))
   7 |         .filter(option => option !== '[Please Select]')
   8 |         .filter(filter ? filter : () => true)
   9 | }
  10 |
  11 | const getRandomOption = async (page: Page, selector: string, timeout = 2, filter: (s: string) => boolean = null) => {
  12 |     const waitUntil = new Date().getSeconds() + timeout
  13 |     let options = []
  14 |     while (options.length == 0 && new Date().getSeconds() <= waitUntil) {
  15 |         options = await getOptions(page, selector, filter)
  16 |     }
  17 |     return options[Math.floor(Math.random() * options.length)]
  18 | }
  19 |
  20 | export const selectOption = async (
  21 |     page: Page,
  22 |     selector: string,
  23 |     option: string = null,
  24 |     filter: (s: string) => boolean = null,
  25 |     attempts = 3
  26 | ): Promise<string> => {
  27 |     // Delius has lots of dynamic drop-down fields that are populated based on previous actions, so wait for any
  28 |     // asynchronous requests to complete before attempting to select an option.
  29 |     await waitForAjax(page)
  30 |     const optionToSelect = option != null ? option : await getRandomOption(page, selector, 2, filter)
  31 |     try {
> 32 |         await page.selectOption(selector, { label: optionToSelect }, { timeout: 5000 })
     |                    ^ TimeoutError: page.selectOption: Timeout 5000ms exceeded.
  33 |         return optionToSelect
  34 |     } catch (e) {
  35 |         if (option == null && attempts > 0) {
  36 |             // Sometimes the options change even after we've waited for asynchronous requests to complete, so retry with
  37 |             // a new random option after 5 seconds
  38 |             return await selectOption(page, selector, option, filter, attempts - 1)
  39 |         } else throw e
  40 |     }
  41 | }
  42 |
  43 | export const fillDate = async (page: Page, selector: string, date: Date) => {
  44 |     await page.fill(selector, DeliusDateFormatter(date))
  45 | }
  46 | export const fillDateOasys = async (page: Page, selector: string, date: Date) => {
  47 |     await page.fill(selector, OasysDateFormatter(date))
  48 | }
  49 |
  50 | export const fillTime = async (page: Page, selector: string, time: Date) => {
  51 |     await page.fill(selector, DeliusTimeFormatter(time))
  52 | }
  53 |
```