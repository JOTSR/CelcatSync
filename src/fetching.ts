import { getWeekStart,addToDate } from './date.ts'
import { parseDescription } from './parsing.ts'
import { calendarEntry, Config, Entry } from '../types.ts'

/**
 * Fecth calendar event of the Celcat endpoint and yield on each entry
 * @param endpoint 'Celcat endpoint'
 * @param query 'Query parameters'
 */
async function *fetchEntries(endpoint: URL, query: FormData): AsyncGenerator<Entry> {
    const data = await fetch(endpoint, {
        method: 'POST',
        body: query
    })

    const entries = await data.json() as calendarEntry[]

    for (const entry of entries) {
        const { start, end, department, faculty, sites, description, eventCategory } = entry
        
        const { title, room, groupeId, staff } = parseDescription(description)

        yield {
            title,
            start: new Date(start),
            end: new Date(end),
            department,
            faculty,
            location: sites?.[0] ?? 'Non renseigné',
            room,
            groupeId,
            eventCategory,
            staff
        }
    }
}

/**
 * Fetch a Celcat calendar according to the config parameter and yield on each event entry
 * @param endpoint 'Celcat endpoint
 * @param config 'Request configuration"
 */
export async function *fetchCalendar(config: Config): AsyncGenerator<Entry> {
    let weekStart = getWeekStart(new Date() < config.dateRange[0] ? config.dateRange[0] : new Date())
    let weekEnd = addToDate(weekStart, { days: 7 })

    while (weekEnd < config.dateRange[1]) {
        const form = new FormData()
        form.append('start', weekStart.toISOString().split('T')[0])
        form.append('end', weekEnd.toISOString().split('T')[0])
        form.append('resType', '103')
        form.append('calView', 'agendaWeek')
        form.append('federationIds[]', config.groupeId)
        form.append('colourScheme', '3')
    
        yield* fetchEntries(new URL(config.endpoint), form)

        ;[weekStart, weekEnd] = [weekEnd, addToDate(weekStart, { days: 7 })]
    }
}