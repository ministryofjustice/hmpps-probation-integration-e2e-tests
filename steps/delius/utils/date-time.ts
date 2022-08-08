export const DeliusDateFormatter = (date: Date) => date.toLocaleDateString('en-GB')
export const Yesterday = () => Date.now() - 24 * 60 * 60 * 1000
