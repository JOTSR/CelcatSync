import { fetchCalendar } from './fetching.ts'
import { ICS, VEvent } from './ics.ts'
import { Config } from '../types.ts'

export async function getCalendarEvents(config: Config) {
	const eventList: VEvent[] = []

	for await (const entry of fetchCalendar(config)) {
		const title = (entry.title?.match(/(^\d\w+) (.*)/) ?? ['', entry.title])
			.slice(1).reverse().join(' ') //Reverse UE code and name

		const vEvent = new VEvent({
			title: `${entry.eventCategory} ${title}`,
			start: entry.start,
			end: entry.end,
			location: `${entry.faculty}, ${entry.location}`,
			category: entry.eventCategory,
			description: `${entry.room}, ${entry.staff} (${entry.department})`,
		})

		eventList.push(vEvent)
	}

	const events = ICS
		.stringify(eventList)
		.replaceAll('\n\n', '\n')
		.replaceAll('\n', '\r\n')
	localStorage.setItem('cached_calendar', events)
	return events
}
