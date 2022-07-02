import { Preset } from './../../database/model/Preset'
import { DatabasePreset, PresetRepository } from './../../database/repository/preset'
import { createDatabaseObject, Database, sendDatabaseObject } from './../database'
import axios from 'axios'
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
				if (value.type === 'e131' && value.data !== null && typeof e131 !== 'undefined') {
					e131.update(
						parseInt(value.universe),
						e131.convertObjectToChannelData(value.data),
						value.fadeTime * 1000
					)
					resolve({})
				} else if (value.type === 'osc' && value.data !== null && typeof osc !== 'undefined') {
					Object.entries(value.data).forEach(presetData => {
						osc.send(presetData)
					})
					resolve({})
				} else if (value.type === 'http' && value.data !== null && value.data.url !== null) {
					// Make the HTTP request
					axios({
						method: value.data.method ?? 'GET',
						url: value.data.url ?? '',
						data: value.data.data ? JSON.parse(value.data.data) : {},
						headers: value.data.headers ? JSON.parse(value.data.headers) : {},
						timeout: 1000,
					})
						.catch(err => {
							logger.info('Preset HTTP request failed', { err })
						})
						.then(() => resolve({}))
				} else if (value.type === 'macro' && value.data !== null) {
					let linkStep: string = null
					value.data.forEach((step: { type: string; value: string; key: string }) => {
						if (step.type === 'preset' && parseInt(step.value) !== value.id && step.value !== null) {
							presetRouter(['recall', step.value], 'GET', {}) // Trigger the preset in the macro
						} else if (step.type === 'link' && step.value !== null) {
							linkStep = step.value
						}
					})
					if (linkStep !== null) resolve({ redirect: linkStep })
					else resolve({})
				} else resolve({})
			})
		} else if (method === 'PUT') {
			return PresetRepository.setAllFromApp(payload as Array<DatabasePreset>)
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
