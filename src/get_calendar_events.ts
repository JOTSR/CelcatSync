import { fetchCalendar } from './fetching.ts'
import { VEvent } from './ics.ts'
import { Config } from '../types.ts'

export async function getCalendarEvents(config: Config) {
	const cacheName = btoa(JSON.stringify(config))
	const eventList: string[] = []

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

		eventList.push(vEvent.toICS().replaceAll('\n\n', '\n'))
	}

	const events = eventList.join('')
	localStorage.setItem(cacheName, events)
	return events
}
