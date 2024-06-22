import { getOperatingSystemUsage } from './operatingSystem/usage'
/**
 * This is a REST router for the about API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const aboutRouter = (
	path: Array<string>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	payload: apiObject
): Promise<apiObject> => {
	logger.debug('About router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (path.length === 0) reject(new Error('Invalid path'))
		switch (path[0]) {
			case 'operatingSystemUsage':
				return getOperatingSystemUsage().then(response => {
					resolve(response as unknown as apiObject)
				})
				break
		}
		reject(new Error('Path not found'))
	})
}
