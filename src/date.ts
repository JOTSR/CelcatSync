/**
 * Get the date of the current week Monday at midnight.
 * @param {Date} currentDate - The date you want to get the week start of.
 * @returns The date corresponding to the monday.
 */
export function getWeekStart(currentDate: Date): Date {
	const lastWeek = currentDate.getTime() -
		(currentDate.getDay() - 2) * 24 * 36e5
	const resetHour = currentDate.getHours() * 36e5 +
		currentDate.getMinutes() * 60e3 +
		currentDate.getSeconds() * 1e3 +
		currentDate.getMilliseconds()

	return new Date(lastWeek - resetHour)
}

/**
 * Increment given date with the options.
 * @param {Date} date - The date to add to.
 * @param - Increment - Date incrementation.
 * @returns A new Date from the addition of the date and the increment.
 */
export function addToDate(
	date: Date,
	{ days, hours, minutes, seconds, milliseconds }: Record<
		string,
		number | undefined
	>,
): Date {
	return new Date(
		date.getTime() +
			(days ?? 0) * 24 * 36e5 +
			(hours ?? 0) * 36e5 +
			(minutes ?? 0) * 60e3 +
			(seconds ?? 0) * 1e3 +
			(milliseconds ?? 0),
	)
}
