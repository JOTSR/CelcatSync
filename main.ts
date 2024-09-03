import { config } from './config.ts'
import { serve } from './deps.ts'

if (Deno.args[0] === '--serve' || Deno.args[0] === '-S') {
	serve(
		async () => {
			try {
				const body = await Deno.readTextFile(saveFileName())
				const response = new Response(body, { status: 200 })
				response.headers.set('content-type', 'text/calendar')
				return response
			} catch {
				return new Response(
					'Internal server error, ressource will be avaible soon',
					{ status: 500 },
				)
			}
		},
		{ port: 9421 },
	)
}
