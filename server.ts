import { config } from './config.example.ts'
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
		} catch {
			return new Response(
				'Internal server error, resource will be avaible soon',
				{ status: 500 },
			)
		}
	},
}
