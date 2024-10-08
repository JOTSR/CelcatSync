import dedent from 'dedent'

export const ICS = {
	/* Parsing the string into an array of VEvent objects. */
	parse(string: string): VEvent[] {
		const entries = string
			.replace('BEGIN:VCALENDAR', '')
			.replace('VERSION:2.0', '')
			.replace('PRODID:-//hacksw/hancal//NONSGML v1.0//EN', '')
			.replace('END:VCALENDAR', '')
			.split('BEGIN:VEVENT')

		return entries.map((entry) => VEvent.fromICS(entry))
	},
	/**
	 * It takes an array of VEvent objects and returns a string of the ICS format.
	 * @param {VEvent[]} vEvents - VEvent[]
	 * @returns A string of the calendar in ICS format.
	 */
	stringify(vEvents: VEvent[]): string {
		return dedent`
        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//hacksw/hancal//NONSGML v1.0//EN
        ${vEvents.map((vEvent) => vEvent.toICS()).join('\n\n')}
        END:VCALENDAR`
	},
	/**
	 * It takes an array of VEvent objects and returns a string of the ICS format.
	 * @param {VEvent[]} vEvent - VEvent[]
	 * @returns A string of the calendar in ICS format.
	 */
	stringifyEvent(vEvent: VEvent): string {
		return `
        ${vEvent.toICS()}`
	},
	get Header() {
		return dedent`
        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//hacksw/hancal//NONSGML v1.0//EN`
	},
	get Footer() {
		return dedent`
        \nEND:VCALENDAR`
	},
}

export type VEventProperties = {
	start: Date
	end: Date
	title: string
	location?: string
	category?: string
	status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED'
	description?: string
	avaible?: boolean
	sequence?: number
}

/**
 * VEvent object representation
 */
export class VEvent {
	#properties: VEventProperties

	constructor(properties: VEventProperties) {
		this.#properties = properties
	}

	get properties(): VEventProperties {
		return structuredClone(this.#properties)
	}

	/**
	 * It takes the properties of the event and returns a string in the format of an ICS file.
	 * @returns A string of the event in ICS format.
	 */
	toICS() {
		const uid = new Date().toISOString().replaceAll(/-|:|\.\d+/g, '')
		const dtend =
			this.#properties.end.getTime() > this.#properties.start.getTime()
				? this.#properties.end
				: this.#properties.start

		return dedent`
        BEGIN:VEVENT
        UID:${uid}-${Math.random()}
        DTSTAMP:${uid}
        DTSTART:${
			this.#properties.start.toISOString().replace(/-|:|\.\d+/g, '')
		}
        DTEND:${dtend.toISOString().replace(/-|:|\.\d+/g, '')}
        SUMMARY:${this.#properties.title.replaceAll(/\r?\n/g, ' ')}
        ${
			this.#properties.location !== undefined
				? `LOCATION:${this.#properties.location.replaceAll(/\r?\n/g, ' ')}`
				: ''
		}
        ${
			this.#properties.category !== undefined
				? `CATEGORIES:${this.#properties.category.replaceAll(/\r?\n/g, ' ')}`
				: ''
		}
        ${
			this.#properties.status !== undefined
				? `STATUS:${this.#properties.start}`
				: ''
		}
        ${
			this.#properties.description !== undefined
				? `DESCRIPTION:${
					this.#properties.description.replaceAll(/\r?\n/g, ' ')
				}`
				: ''
		}
        ${
			this.#properties.avaible !== undefined
				? `TRANSP:${this.#properties.avaible ? 'OPAQUE' : 'TRANSPARENT'}`
				: ''
		}
        SEQUENCE:1
        END:VEVENT`
	}

	/**
	 * Transform an ICS string into a VEvent instance
	 * @param {string} ics - string - The ics file as a string
	 * @returns A VEvent object.
	 */
	static fromICS(ics: string): VEvent {
		const entries = ics
			.split('\n')
			.filter((entry) =>
				!entry.includes('BEGIN:VEVENT') && !entry.includes('END:VEVENT')
			)

		const transp =
			entries.filter((entry) => entry.includes('TRANSP'))[0].split(':')[1]

		const dtSeparators = [
			undefined,
			'-',
			undefined,
			'-',
			undefined,
			undefined,
			undefined,
			':',
			undefined,
			':',
		]
		const dtstart = entries
			.filter((entry) => entry.includes('DTSTART'))[0]
			.split(':')[1]
			.match(/(\d{4})(\d{2})(\d{2})(T)(\d{2})(\d{2})(\d{2})/)
			?.slice(1)
			.flatMap((e) => [e, e])
			.map((e, i) => i % 2 ? dtSeparators[i] : e)
			.join('')

		const dtend = entries
			.filter((entry) => entry.includes('DTEND'))[0]
			.split(':')[1]
			.split(':')[1]
			.match(/(\d{4})(\d{2})(\d{2})(T)(\d{2})(\d{2})(\d{2})/)
			?.slice(1)
			.flatMap((e) => [e, e])
			.map((e, i) => i % 2 ? dtSeparators[i] : e)
			.join('')

		const properties = {
			start: new Date(`${dtstart}Z`),
			end: new Date(`${dtend}Z`),
			title:
				entries.filter((entry) => entry.includes('SUMMARY'))[0].split(':')[1],
			location:
				entries.filter((entry) => entry.includes('LOCATION'))[0].split(':')[1],
			category:
				entries.filter((entry) => entry.includes('CATEGORIES'))[0].split(
					':',
				)[1],
			status:
				entries.filter((entry) => entry.includes('STATUS'))[0].split(':')[1],
			description:
				entries.filter((entry) => entry.includes('DESCRIPTION'))[0].split(
					':',
				)[1],
			avaible: transp === 'OPAQUE'
				? true
				: transp === 'TRANSPARENT'
				? false
				: undefined,
			sequence: 1,
		} as VEventProperties

		return new VEvent(properties)
	}
}
