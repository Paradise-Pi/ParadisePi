import { DatabaseFader, FaderRepository } from '../../database/repository/fader'
import { createDatabaseObject, Database, sendDatabaseObject } from '../database'
/**
 * This is a REST router for the fader API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const faderRouter = (
	path: Array<string>,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	logger.debug('Fader router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'PUT') {
			return FaderRepository.setAllFromApp(payload as Array<DatabaseFader>)
				.then(() => {
					return createDatabaseObject('updating all faders in bulk')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					resolve({})
				})
		} else reject(new Error('Path not found'))
	})
}
