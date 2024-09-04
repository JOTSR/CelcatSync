import { config } from './config.ts'
import { getCalendarEvents } from './src/get_calendar_events.ts'

export default {
	async fetch() {
		try {
			const events = await getCalendarEvents(config)
			return new Response(events, {
				headers: {
					'Content-Type': 'text/calendar',
				},
			})
		} catch (e) {
			console.error(e)
			return new Response(
				'Internal server error, resource will be avaible soon',
				{ status: 500 },
			)
		}
	},
}
