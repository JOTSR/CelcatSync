/**
 * "Get the date of the last Monday at midnight.
 * @param {Date} currentDate - Date - The date you want to get the week start of.
 * @returns A date object.
 */
export function getWeekStart(currentDate: Date): Date {
    const lastWeek = currentDate.getTime() - (currentDate.getDay() - 2) * 24 * 36e5
    const resetHour =
        currentDate.getHours() * 36e5 +
        currentDate.getMinutes() * 60e3 +
        currentDate.getSeconds() * 1e3 +
        currentDate.getMilliseconds()

    return new Date(lastWeek - resetHour)
}

/**
 * It takes a date and an object with optional days, hours, minutes, seconds, and milliseconds
 * properties, and returns a new date that is the original date plus the specified time
 * @param {Date} date - Date - The date to add to
 * @param  - Date - The date to add to
 * @returns A new Date object with the specified number of days, hours, minutes, seconds, and
 * milliseconds added to the original date.
 */
export function addToDate(date: Date, {days, hours, minutes, seconds, milliseconds}: Record<string, number | undefined>): Date {
    return new Date(
        date.getTime() +
        (days ?? 0) * 24 * 36e5 +
        (hours ?? 0) * 36e5 +
        (minutes ?? 0) * 60e3 +
        (seconds ?? 0) * 1e3 +
        (milliseconds ?? 0)
    )
}