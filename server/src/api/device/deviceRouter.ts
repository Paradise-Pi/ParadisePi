import { Database } from '../../../../shared/database'
import { DatabaseDevice } from '../../../../shared/sharedTypes'
import { DeviceRepository } from '../../database/repository/device'
import logger from '../../logger'
import { createDatabaseObject, sendDatabaseObject } from '../database'
import { httpMethods } from '../router'
/**
 * This is a REST router for the device API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const deviceRouter = (path: Array<string>, method: httpMethods, payload: apiObject): Promise<apiObject> => {
	logger.silly('Device router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'PUT') {
			return DeviceRepository.setAllFromApp(payload as Array<DatabaseDevice>)
				.then(() => {
					return createDatabaseObject('updating all devices in bulk')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					resolve({})
				})
		} else reject(new Error('Path not found'))
	})
}
