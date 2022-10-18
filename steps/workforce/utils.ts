const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
export const WorkforceDateFormat = (date: Date) => {
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
}