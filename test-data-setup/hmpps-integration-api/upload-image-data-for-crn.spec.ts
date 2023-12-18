import { test, expect, PageScreenshotOptions} from '@playwright/test'
import config from "../../playwright.config";
import {
    captureScreenshotAsBuffer,
    createAndBookPrisoner,
    releasePrisoner,
    uploadImageFromBuffer
} from "../../steps/api/dps/prison-api";
import {login as loginDelius} from "../../steps/delius/login";
import {deliusPerson} from "../../steps/delius/utils/person";
import {createOffender} from "../../steps/delius/offender/create-offender";

test("Download and upload image for offender", async({ page }) => {
    //URL based on content from the following sources:
    //https://github.com/ministryofjustice/prison-api/blob/02c0e3b842848dfa330bd01497d5e0a5b6fceaf6/README.MD?plain=1#L193C6-L204

    //File Retrieval
    const fileName = "personDoesNotExist.png"
    const url = "https://thispersondoesnotexist.com/"
    const fileBuffer = await captureScreenshotAsBuffer(page, url, fileName)

    //Offender Creation and upload
    await loginDelius(page)
    const person = deliusPerson()
    const crn = await createOffender(page, { person })
    const { nomisId } = await createAndBookPrisoner(page, crn, person)
    console.log(crn, nomisId)
    console.log(person)
    const imageId = await uploadImageFromBuffer(nomisId, fileBuffer, fileName)
    console.log(imageId)
    await releasePrisoner(nomisId)
})

