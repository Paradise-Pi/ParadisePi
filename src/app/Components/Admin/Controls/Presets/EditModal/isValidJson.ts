/**
 * https://stackoverflow.com/a/20392392/3088158
 */
export const isValidJson = (jsonString: string) => {
	try {
		const jsonParse = JSON.parse(jsonString)

		/**
		 * Handle non-exception-throwing cases:
		 * Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		 * but... JSON.parse(null) returns null, and typeof null === "object",
		 * so we must check for that, too. Thankfully, null is falsey, so this suffices:
		 **/
		if (jsonParse && typeof jsonParse === 'object') return true
		else return false
	} catch {
		return false
	}
}
