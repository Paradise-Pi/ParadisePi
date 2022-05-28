import { DatabasePresetFolder, PresetFolderRepository } from './../../database/repository/presetFolder'
/**
 * This is a REST router for the preset folder API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const presetFolderRouter = (
	path: Array<string>,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	logger.debug('Preset folder router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'GET') {
			return PresetFolderRepository.getOne(payload['presetFolderId']).then((response: DatabasePresetFolder) => {
				resolve({
					data: response,
				})
			})
		} else reject(new Error('Path not found'))
	})
}
