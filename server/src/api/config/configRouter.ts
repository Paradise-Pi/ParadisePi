import { createOSC, destroyOSC } from '../../output/osc/constructor'
import { ConfigRepository } from '../../database/repository/config'
import { createE131, destroyE131 } from '../../output/e131/constructor'
import { createDatabaseObject, sendDatabaseObject } from '../database'
import logger from '../../logger'
import { Database } from '../../../../shared/database'
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
	logger.debug('Config router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'POST') {
			let restartE131 = false
			return Promise.all(
				Object.entries(payload).map(async ([key, value]) => {
					if (value === true) value = 'true'
					else if (value === false) value = 'false'
					else if (value === 'null') value = null
					if (key.includes('e131')) restartE131 = true // Only restart e131 output IF there is some e131 that's been changed
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
					if (restartE131) return destroyE131()
					return Promise.resolve()
				})
				.then(() => {
					if (restartE131) createE131()
					// Recreate OSC connection
					destroyOSC()
					createOSC()
					// Return response to window
					resolve({})
				})
		} else reject(new Error('Path not found'))
	})
}
