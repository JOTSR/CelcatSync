import { Description } from '../types.ts'

/**
 * It takes a string, splits it into an array of strings, then returns an object with the first string
 * as the title, the second as the group ID, the third as the staff, the fourth as the location, and
 * the fifth as the room
 * @param {string} description - string
 * @returns An object with the following properties:
 */
export function parseDescription(description: string): Description {
	try {
		const [
			category,
			title,
			groupeId,
			staff,
			rawLocation,
		] = decodeHtmlString(description).split('\r\n\r\n<br />\r\n\r\n')

		const location = rawLocation.split('/')[0]
		const room = decodeHtmlString(rawLocation.split('/ ')[1])

		return {
			category,
			title,
			groupeId,
			staff: staff.replaceAll('<br />', ', '),
			location,
			room,
		}
	} catch {
		const [
			category,
			groupeId,
			_,
			title,
		] = decodeHtmlString(description).split('\r\n\r\n<br />\r\n\r\n')
		return {
			category,
			title,
			groupeId,
			staff: 'Non renseigné',
			location: 'Non renseigné',
			room: 'Non renseigné',
		}
	}
}

/**
 * It takes a string, finds all the HTML character codes in it, replaces them with their corresponding
 * characters, and returns the result.
 * @param {string} string - The string to decode.
 * @returns A function that takes a string and returns a string.
 */
export function decodeHtmlString(string: string): string {
	const codes = [...new Set(string.match(/&#\d+;/g))]

	const chars = codes.map((code) => {
		const number = parseInt(code.slice(2))
		return String.fromCharCode(number)
	})

	for (const index of codes.keys()) {
		string = string.replaceAll(codes[index], chars[index])
	}

	return string
}
