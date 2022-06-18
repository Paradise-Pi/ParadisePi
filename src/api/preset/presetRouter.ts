import { Preset } from './../../database/model/Preset'
import { DatabasePreset, PresetRepository } from './../../database/repository/preset'
import { createDatabaseObject, Database, sendDatabaseObject } from './../database'
/**
 * This is a REST router for the preset API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const presetRouter = (
	path: Array<string>,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	logger.debug('Preset router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'GET' && path[0] === 'recall') {
			return PresetRepository.findOneOrFail({ where: { id: parseInt(path[1]) } }).then((value: Preset) => {
				logger.verbose('Preset recalled', { value })
				if (value.type === 'e131' && value.data !== null) {
					e131.update(
						parseInt(value.universe),
						e131.convertObjectToChannelData(value.data),
						value.fadeTime * 1000
					)
				} else if (value.type === 'osc' && value.data !== null) {
					Object.entries(value.data).forEach(([address, args]) => {
						osc.send(address, args)
					})
				}
				resolve({})
			})
		} else if (method === 'PUT') {
			return PresetRepository.setAll(payload as Array<DatabasePreset>)
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
