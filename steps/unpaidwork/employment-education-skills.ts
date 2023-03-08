import { expect, type Page } from '@playwright/test'

export const completeEmplEducationSkillsSection = async (page: Page) => {
    await page.locator('#employment_education').click()
    await page.locator('#employment_education_details_fulltime').fill('Entering Text related to Full-time education')
    await page.locator('#reading_writing_difficulties').click()
    await page.locator('#reading_writing_difficulties_details').fill('Entering Text related to Full-time education')
    await page.locator('#work_skills').click()
    await page.locator('#work_skills_details').fill('Entering Text related to work skills')
    await page.locator('#future_work_plans').click()
    await page.locator('#future_work_plans_details').fill('Entering Text related to future work plans')
    await page.locator('#employment_education_skills_complete').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.locator('li:has-text("Employment, education and skills")').first()).toContainText(('COMPLETED').toLowerCase())
    await expect(page.locator('#main-content h1')).toHaveText('Community payback assessment')
    await expect(page.locator('.govuk-caption-l')).toHaveText(
        'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    )
}
