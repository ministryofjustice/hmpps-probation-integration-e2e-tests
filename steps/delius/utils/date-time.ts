import { DateTime, Duration } from 'luxon'

export const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
export const HmppsDateFormatter = (date: Date): string => DateTime.fromJSDate(date).toFormat('d MMM yyyy')
export const DeliusDateFormatter = (date: Date): string => DateTime.fromJSDate(date).toFormat('dd/MM/yyyy')
export const OasysDateFormatter = (date: Date): string => DateTime.fromJSDate(date).toFormat('dd/MM/yyyy')
export const DeliusTimeFormatter = (time: Date): string => {
    const dt = DateTime.fromJSDate(time)
    return `${dt.hour.toString().padStart(2, '0')}:${dt.minute.toString().padStart(2, '0')}`
}

export const get12Hour = (date: Date): number => {
    const dt = DateTime.fromJSDate(date)
    return dt.hour > 12 ? dt.hour - 12 : dt.hour
}

/**
    Returns a working-day date (Mon–Fri only) in "d/M/yyyy" format.
    @param offsetWorkingDays Number of working days to move (+1, -1, +10, etc.)
    @param baseDate Optional base date (defaults to today)
 */
export function getWorkingDayForEsupervision(
    offsetWorkingDays: number,
    baseDate: DateTime = DateTime.now().setZone('Europe/London')
): string {
    let current = baseDate.startOf('day')

    // If no offset, return the nearest working day
    if (offsetWorkingDays === 0) {
        current = moveToWorkingDay(current, 1)
        return current.toFormat('d/M/yyyy')
    }

    const direction = offsetWorkingDays > 0 ? 1 : -1
    const steps = Math.abs(offsetWorkingDays)
    let moved = 0

    while (moved < steps) {
        current = current.plus({ days: direction })
        if (isWeekday(current)) {
            moved++
        }
    }

    return current.toFormat('d/M/yyyy')
}

function isWeekday(date: DateTime): boolean {
    // Luxon: 1 = Monday, 7 = Sunday
    return date.weekday >= 1 && date.weekday <= 5
}

function moveToWorkingDay(date: DateTime, direction: 1 | -1): DateTime {
    let d = date
    while (!isWeekday(d)) {
        d = d.plus({ days: direction })
    }
    return d
}

export const getTimeOfDay = (date: Date): 'am' | 'pm' => (DateTime.fromJSDate(date).hour < 12 ? 'am' : 'pm')
export const Tomorrow = DateTime.now().plus({ days: 1 })
export const NextWeek = DateTime.now().plus({ weeks: 1 })
export const LastMonth = DateTime.now().minus({ months: 1 })
export const NextMonth = DateTime.now().plus({ months: 1 })
export const Yesterday = DateTime.now().minus({ days: 1 })

export const addDays = (date: DateTime, days: number): DateTime => {
    return date.plus({ days })
}

export const addMonths = (date: DateTime, months: number): DateTime => {
    return date.plus({ months })
}

export const getDate = (date: DateTime): number => {
    return date.day
}

export const getMonth = (date: DateTime): number => {
    return date.month // Luxon months are already 1-based
}

export const getYear = (date: DateTime): number => {
    return date.year
}

export const subDays = (date: DateTime, days: number): DateTime => {
    return date.minus({ days })
}

export const subMonths = (date: DateTime, months: number): DateTime => {
    return date.minus({ months })
}

export const formatDate = (date: Date | DateTime, formatString: string): string => {
    let dateTime: DateTime

    if (date instanceof Date) {
        // Convert Date to DateTime
        dateTime = DateTime.fromJSDate(date)
    } else if (DateTime.isDateTime(date)) {
        // If it's already a DateTime, use it directly
        dateTime = date
    } else {
        throw new Error('Invalid date input: must be a Date or DateTime object.')
    }

    return dateTime.toFormat(formatString)
}

export const minutesToMilliseconds = (minutes: number): number => {
    return Duration.fromObject({ minutes }).as('milliseconds')
}

export const secondsToMilliseconds = (seconds: number): number => {
    return Duration.fromObject({ seconds }).as('milliseconds')
}

export function getCurrentDay() {
    return DateTime.now().weekdayLong
}

export function uiDateToIso(uiDate: string): string {
    const dt = DateTime.fromFormat(uiDate.trim(), 'd/M/yyyy', { zone: 'Europe/London' })

    if (!dt.isValid) {
        throw new Error(`Invalid UI date "${uiDate}". Luxon error: ${dt.invalidExplanation ?? dt.invalidReason}`)
    }

    return dt.toFormat('yyyy-MM-dd')
}
