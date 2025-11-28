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
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()]
}
