import { config } from './config.ts'
import { Cron, outdent, serve } from './deps.ts'
import { fetchCalendar } from './src/fetching.ts'
import { ICS, VEvent } from './src/ics.ts'

const saveFileName = () => `./${(new Date).toISOString().split('T')[0]}.ics`

Cron[config.cronConfig](() => periodicUpdate(saveFileName()))

async function periodicUpdate(saveFileName: string) {
    Deno.writeTextFile(saveFileName, outdent.string(ICS.Header), { append: false })

    for await (const entry of fetchCalendar(config)) {

        const title = (entry.title?.match(/(^\d\w+) (.*)/) ?? ['', entry.title]).slice(1).reverse().join(' ') //Reverse UE code and name

        const vEvent = new VEvent({
            title: `${entry.eventCategory} ${title}`,
            start: entry.start,
            end: entry.end,
            location: `${entry.faculty}, ${entry.location}`,
            category: entry.eventCategory,
            description: `${entry.room}, ${entry.staff} (${entry.department})`,
        })

        const event = outdent.string(ICS.stringifyEvent(vEvent)).replaceAll('\n\n', '\n')
        Deno.writeTextFile(saveFileName, event, { append: true })
    }
    Deno.writeTextFile(saveFileName, outdent.string(ICS.Footer), { append: true })
}

await periodicUpdate(saveFileName())

if (Deno.args[0] === '--serve' || Deno.args[0] === '-S') {
    serve(
        async () => {
            try {
                Deno.lstat(saveFileName()).catch(async () => await periodicUpdate(saveFileName()))
                const body = await Deno.readTextFile(saveFileName())
                const response = new Response(body, { status: 200 })
                response.headers.set('content-type', 'text/calendar')
                return response                
            } catch {
                return new Response('Internal server error, ressource will be avaible soon', { status: 500 })
            }
        },
        { port: 9421 }
    )
}