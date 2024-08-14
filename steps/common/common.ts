import { format, minutesToMilliseconds } from 'date-fns'
import { test } from '@playwright/test'

export const splitDate = (date: Date) => {
    return format(date, 'dd MM yyyy').split(' ')
}

export const slow = (minutes: number = 7) => {
    test.setTimeout(minutesToMilliseconds(minutes))
}
