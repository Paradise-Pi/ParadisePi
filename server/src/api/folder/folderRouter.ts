import { Database, DatabaseFolder } from '../../../../shared/database'
import { FolderRepository } from '../../database/repository/folder'
import { createDatabaseObject, sendDatabaseObject } from '../database'
/**
 * This is a REST router for the preset folder API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const folderRouter = (
	path: Array<string>,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	logger.debug('Preset folder router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'PUT') {
			return FolderRepository.setAllFromApp(payload as Array<DatabaseFolder>)
				.then(() => {
					return createDatabaseObject('updating all presets in bulk')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					resolve({})
				})
		} else reject(new Error('Path not found'))
	})
}
