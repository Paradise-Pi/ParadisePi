import { Database, DatabaseTimeClockTrigger } from '../../../../shared/database'
import { TimeClockTriggersRepository } from '../../database/repository/timeClockTrigger'
import logger from '../../logger'
import { createDatabaseObject, sendDatabaseObject } from '../database'
import { httpMethods } from '../router'
/**
 * This is a REST router for the preset API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const timeClockTriggersRouter = (
	path: Array<string>,
	method: httpMethods,
	payload: apiObject
): Promise<apiObject> => {
	logger.silly('Time clock trigger router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'PUT') {
			return TimeClockTriggersRepository.setAllFromApp(payload as Array<DatabaseTimeClockTrigger>)
				.then(() => {
					return createDatabaseObject('updating all time clock triggers in bulk')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					resolve({})
				})
		} else reject(new Error('Path not found'))
	})
}
