import axios from 'axios'
import { Database, DatabasePreset } from '../../../../shared/database'
import { Preset } from '../../database/model/Preset'
import { ConfigRepository } from '../../database/repository/config'
import { PresetRepository } from '../../database/repository/preset'
import logger from '../../logger'
import { createDatabaseObject, sendDatabaseObject } from '../database'
import { parseJSON } from '../parseUserJson'
import { httpMethods } from '../router'
/**
 * This is a REST router for the preset API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const presetRouter = (path: Array<string>, method: httpMethods, payload: apiObject): Promise<apiObject> => {
	logger.silly('Preset router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (method === 'GET' && (path[0] === 'recall' || path[0] === 'recall-user')) {
			return PresetRepository.findOneOrFail({ where: { id: parseInt(path[1]) } }).then((value: Preset) => {
				logger.log(
					'history',
					`${value.name} preset recalled ${path[0] === 'recall-user' ? 'by user' : 'internally'}`,
					{
						historyType: path[0] === 'recall-user' ? 'preset' : 'preset-internal',
						presetId: value.id,
						presetName: value.name,
						presetType: value.type,
					}
				)
				if (value.type === 'e131' && value.data !== null && typeof e131 !== 'undefined') {
					e131.update(
						parseInt(value.universe ? value.universe : '1'),
						e131.convertObjectToChannelData(value.data),
						value.fadeTime * 1000
					)
					resolve({})
				} else if (value.type === 'osc' && value.data !== null && typeof osc !== 'undefined') {
					Object.entries(value.data).forEach(presetData => {
						osc.sendPreset(presetData[1]) //we want the object part of each entry
					})
					resolve({})
				} else if (value.type === 'http' && value.data !== null && value.data.url !== null) {
					let deviceHost = ''
					// Evaluate if there's a device involved that we need to prefix
					if (value.device !== null && value.device.id !== null) {
						if (value.device.ip !== null && value.device.ip !== '') deviceHost = 'http://' + value.device.ip
						else if (value.device.endpoint !== null && value.device.endpoint !== '')
							deviceHost = value.device.endpoint
					}
					// Make the HTTP request
					axios({
						method: value.data.method ?? 'GET',
						url: `${deviceHost}${value.data.url ?? ''}`,
						data: value.data.data ? parseJSON(value.data.data) : null,
						headers: value.data.headers ? parseJSON(value.data.headers) : null,
						timeout: 60000, // 60 seconds
					})
						.catch(err => {
							logger.warn('Preset HTTP request failed', { err })
						})
						.then(() => resolve({}))
				} else if (value.type === 'macro' && value.data !== null) {
					let linkStep: string = null
					const configUpdate: Array<{ key: string; value: string }> = []
					value.data.forEach((step: { type: string; value: string; key: string }) => {
						if (step.type === 'preset' && parseInt(step.value) !== value.id && step.value !== null) {
							presetRouter(['recall', step.value], 'GET', {}) // Trigger the preset in the macro
						} else if (step.type === 'link' && step.value !== null) {
							linkStep = step.value
						} else if (step.type === 'configuration' && step.value !== null) {
							if (step.value === 'CONTROLPANEL-LOCKED') {
								configUpdate.push({ key: 'deviceLock', value: 'LOCKED' })
							} else if (step.value === 'CONTROLPANEL-UNLOCKED') {
								configUpdate.push({ key: 'deviceLock', value: 'UNLOCKED' })
							}
						}
					})
					return ConfigRepository.save(configUpdate)
						.then(() => {
							return createDatabaseObject('change of config from macro')
						})
						.then((response: Database) => {
							sendDatabaseObject(response)
							resolve(linkStep !== null ? { redirect: linkStep } : {})
						})
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
