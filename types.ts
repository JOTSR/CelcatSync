export type Config = {
	endpoint: string
	groupeId: string
	tdId: string
	dateRange: [Date, Date]
	cronConfig: 'daily' | 'weekly' | 'monthly'
	filter?: (Entry: Entry) => boolean
	map?: (Entry: Entry) => Entry
}

export type Fn<T, U> = (args: T) => U

export type calendarEntry = {
	id: string
	start: string //Date string
	end: string //Date string
	allDay: boolean
	description: string
	backgroundColor: string
	textColor: string
	department: string
	faculty: string
	eventCategory: string
	sites: string[]
	modules: unknown
	registerStatus: number
	studentMark: number
	custom1: unknown
	custom2: unknown
	custom3: unknown
}

export type Description = {
	title: string
	category: string
	groupeId: string
	staff: string
	location: string
	room: string
}

export type Entry = {
	title: string
	start: Date
	end: Date
	department: string
	faculty: string
	location: string
	room: string
	groupeId: string
	eventCategory: string
	staff: string
	_raw: {
		description: string
	}
}
