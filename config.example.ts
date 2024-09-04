import { Config } from './types.ts'

export const config: Config = {
	endpoint: 'https://celcat.u-bordeaux.fr/calendar/Home/GetCalendarData',
	groupeId: '31SV82CM',
	tdId: '',
	dateRange: [new Date('2022-09-01'), new Date('2023-01-01')],
	cronConfig: 'daily',
	timeZone: 'Europe/Paris',
}
