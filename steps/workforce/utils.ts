import { DateTime } from 'luxon'

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

export const WorkforceDateFormat = (date: DateTime) => {
    if (!date.isValid) {
        throw new Error('Invalid DateTime object provided')
    }

    const day = date.day
    const month = months[date.month - 1]
    const year = date.year

    return `${day} ${month} ${year}`
}
