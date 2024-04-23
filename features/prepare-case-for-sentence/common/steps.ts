import { Given, Then } from '@cucumber/cucumber'
import { prepareCaseForSentenceLogin } from '../../../steps/prepare-case-for-sentence/login.ts'
import { getCRNByNameFromCaseList } from '../../../steps/prepare-case-for-sentence/application.ts'

Given('I am logged in', function (this) {
    return prepareCaseForSentenceLogin(this.page)
})

Then('I see the court room hearings page with defendant name {string}', function (this, defendantName) {
    return getCRNByNameFromCaseList(this.page, defendantName)
})
