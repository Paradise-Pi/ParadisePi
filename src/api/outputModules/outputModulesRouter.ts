/**
 * This is a REST router for the output modules API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const outputModulesRouter = (
	path: Array<string>,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	logger.debug('e131 scanner router has a request', { path, method, payload })
	return new Promise(resolve => {
		if (path[0] === 'e131') {
			if (path[1] === 'startSampling') {
				return globalThis.e131.sampleE131().then(() => resolve({}))
			}
		}
	})
}
