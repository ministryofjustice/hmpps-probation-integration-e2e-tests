export const DeliusDateFormatter = (date: Date) => date.toLocaleDateString('en-GB')
export const DeliusTimeFormatter = (time: Date) =>
    `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
export const Yesterday = () => Date.now() - 24 * 60 * 60 * 1000
export const EuropeLondonFormat = (date: Date) =>
    date.toLocaleString("sv",{timeZone:"Europe/London"}).replace(" ","T")

