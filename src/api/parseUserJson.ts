/**
 * Wrapper for the JSON.parse function - allowing us to catch any errors and return null instead
 * @param json - the JSON string to parse
 * @returns the parsed JSON object or null if there was an error
 */
export const parseJSON = (json: string) => {
	if (json !== undefined && json !== null && typeof json === 'string' && json.length > 0) {
		try {
			const result = JSON.parse(json)
			return result
		} catch {
			return null
		}
	} else return null
}
