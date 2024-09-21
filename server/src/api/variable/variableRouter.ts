import { Database } from '../../../../shared/database'
import { DatabaseVariable } from '../../../../shared/sharedTypes'
import { VariableRepository } from '../../database/repository/variable'
import logger from '../../logger'
import { createDatabaseObject, sendDatabaseObject } from '../database'
import { httpMethods } from '../router'
/**
 * This is a REST router for the variable API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const variableRouter = (path: Array<string>, method: httpMethods, payload: apiObject): Promise<apiObject> => {
	logger.silly('Variable router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'POST' && path[0] === 'set') {
			return VariableRepository.setOne(payload.id, payload.value)
				.then(() => {
					return createDatabaseObject('setting a variable')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					resolve({})
				})
		} else if (method === 'PUT') {
			return VariableRepository.setAllFromApp(payload as Array<DatabaseVariable>)
				.then(() => {
					return createDatabaseObject('updating all variables in bulk')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					resolve({})
				})
		} else reject(new Error('Path not found'))
	})
}
