import { When } from '@cucumber/cucumber'
import { addCourtToUser } from '../../../steps/prepare-case-for-sentence/application.ts'

When('I select court {string}', function (this, courtName) {
    return addCourtToUser(this.page, courtName)
})
