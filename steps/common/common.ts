import { test } from '@playwright/test'
import {DateTime, Duration} from "luxon"

export const splitDate = (date: DateTime) => {
    if (!date || !date.isValid) {
        throw new Error('Invalid DateTime object provided')
    }

    return [date.day.toString(), date.month.toString(), date.year.toString()]
}

export const slow = (minutes: number = 7) => {
    const duration = Duration.fromObject({ minutes })
    test.setTimeout(duration.as('milliseconds'))
};
