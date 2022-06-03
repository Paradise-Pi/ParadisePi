import { ConfigRepository } from './../../database/repository/config'
import { createE131 } from './../../output/e131/constructor'
import { createDatabaseObject, Database, sendDatabaseObject } from './../database'
/**
 * This is a REST router for the preset API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const configRouter = (
	path: Array<string>,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	logger.debug('Preset router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'POST') {
			return Promise.all(
				Object.entries(payload).map(async ([key, value]) => {
					await ConfigRepository.save({
						key,
						value,
					})
				})
			)
				.then(() => {
					return createDatabaseObject('change of config')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					return e131.terminate()
				})
				.then(() => {
					console.log('E131 terminated')
					createE131()
					resolve({})
				})
		} else reject(new Error('Path not found'))
	})
}
