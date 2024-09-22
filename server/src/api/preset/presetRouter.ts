import axios from 'axios'
import { Database, DatabasePreset } from '../../../../shared/database'
import { Preset } from '../../database/model/Preset'
import { ConfigRepository } from '../../database/repository/config'
import { PresetRepository } from '../../database/repository/preset'
import { VariableRepository } from '../../database/repository/variable'
import logger from '../../logger'
import { createDatabaseObject, sendDatabaseObject } from '../database'
import { parseJSON } from '../parseUserJson'
import { httpMethods } from '../router'
import { tcpRequest } from './tcpRequest'
import { VariableLogic, variablesLogicParser } from './variablesLogicParser'
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
			return PresetRepository.findOneOrFail({ where: { id: parseInt(path[1]) } })
				.then((value: Preset) => {
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
							if (value.device.ip !== null && value.device.ip !== '')
								deviceHost = `http://${value.device.ip}:${value.device.port}`
							else if (value.device.endpoint !== null && value.device.endpoint !== '')
								deviceHost = value.device.endpoint
						}
						// Make the HTTP request - DON'T FORGET THIS IS ALSO DUPLICATED BELOW
						axios({
							method: value.data.method ?? 'GET',
							url: `${deviceHost}${value.data.url ?? ''}`,
							data: value.data.data ? parseJSON(value.data.data) : null,
							headers: value.data.headers ? parseJSON(value.data.headers) : null,
							timeout: 60000, // 60 seconds
							transformResponse: x => x, // Prevent axios from trying to parse the response into an object
						})
							.catch(err => {
								logger.warn('Preset HTTP request failed', { err })
								return variablesLogicParser(value.variableLogic as VariableLogic, null, true).then(() =>
									Promise.resolve()
								)
							})
							.then(response => {
								logger.debug('Preset HTTP request succeeded', response ? response.data : null)
								if (response)
									return variablesLogicParser(
										value.variableLogic as VariableLogic,
										response.data,
										false
									).then(() => Promise.resolve())
								else
									return variablesLogicParser(value.variableLogic as VariableLogic, null, true).then(
										() => Promise.resolve()
									)
							})
							.then(() => resolve({}))
					} else if (value.type === 'macro' && value.data !== null) {
						let linkStep: string = null
						const configUpdate: Array<{ key: string; value: string }> = []
						return Promise.all(
							value.data.map((step: { type: string; value: string; valueTwo: string; key: string }) => {
								if (
									step.type === 'preset' &&
									parseInt(step.value) !== value.id &&
									step.value !== null
								) {
									return presetRouter(['recall', step.value], 'GET', {}) // Trigger the preset in the macro
								} else if (step.type === 'link' && step.value !== null) {
									linkStep = step.value
									return Promise.resolve()
								} else if (step.type === 'folder' && step.value !== null) {
									linkStep = `/controlPanel/folder/${step.value}`
									return Promise.resolve()
								} else if (step.type === 'configuration' && step.value !== null) {
									if (step.value === 'CONTROLPANEL-LOCKED') {
										configUpdate.push({ key: 'deviceLock', value: 'LOCKED' })
										return Promise.resolve()
									} else if (step.value === 'CONTROLPANEL-UNLOCKED') {
										configUpdate.push({ key: 'deviceLock', value: 'UNLOCKED' })
										return Promise.resolve()
									}
								} else if (step.type === 'variable' && step.value !== null && step.valueTwo !== null) {
									logger.debug('Setting variable from macro preset', {
										key: step.value,
										value: step.valueTwo,
									})
									return VariableRepository.setOne(parseInt(step.value), step.valueTwo)
								}
							})
						)
							.then(() => ConfigRepository.save(configUpdate))
							.then(() => {
								logger.debug('Macro preset completed')
								return createDatabaseObject('change of config from macro, or change of variables')
							})
							.then((response: Database) => {
								sendDatabaseObject(response)
								resolve(linkStep !== null ? { redirect: linkStep } : {})
							})
					} else if (
						value.type === 'tcp' &&
						value.data !== null &&
						value.device !== null &&
						value.device.id !== null &&
						value.device.ip !== null &&
						value.device.ip !== ''
					) {
						tcpRequest(value.device.ip, value.device.port, value.data.message, value.data.timeout ?? 60)
							.catch(err => {
								logger.warn('Preset TCP request failed', err)
								return variablesLogicParser(value.variableLogic as VariableLogic, null, true).then(() =>
									Promise.resolve()
								)
							})
							.then(response => {
								logger.debug('Preset TCP request succeeded', response ? response.data : null)
								if (response)
									return variablesLogicParser(
										value.variableLogic as VariableLogic,
										response.data,
										false
									).then(() => Promise.resolve())
								else
									return variablesLogicParser(value.variableLogic as VariableLogic, null, true).then(
										() => Promise.resolve()
									)
							})
							.then(() => resolve({}))
					} else resolve({})
				})
				.catch(err => {
					logger.warn('Preset recall failed - preset not found', err)
					resolve({})
				})
		}
		if (method === 'GET' && path[0] === 'test') {
			if (path[1] === 'http' && payload.data !== null && payload.data.url !== null) {
				// Make the test HTTP request - DONT FORGET DUPLICATED ABOVE
				logger.debug('Testing HTTP request', { payload })
				axios({
					method: payload.data.method ?? 'GET',
					url: `${payload.deviceHost}${payload.data.url ?? ''}`,
					data: payload.data.data ? parseJSON(payload.data.data) : null,
					headers: payload.data.headers ? parseJSON(payload.data.headers) : null,
					timeout: 60000, // 60 seconds
					transformResponse: x => x, // Prevent axios from trying to parse the response into an object
				})
					.catch(err => {
						logger.warn('Preset HTTP request failed', { err })
						resolve({ error: err.message })
					})
					.then(response => {
						logger.debug('Preset HTTP request succeeded', response ? response.data : null)
						resolve({ response: response ? response.data : null })
					})
			} else if (path[1] === 'tcp' && payload.ip !== null && payload.deviceHost !== null) {
				// Make the TCP request
				if (payload.message === null) resolve({ error: 'Blank' })
				logger.debug('Testing TCP request', { payload })
				tcpRequest(payload.ip, payload.port, payload.message, payload.timeout ?? 60)
					.catch(err => {
						logger.warn('Preset TCP request failed', err)
						resolve({ error: err })
					})
					.then(response => {
						logger.debug('Preset TCP request succeeded', response ? response.data : null)
						if (response) resolve({ data: response.data, speed: response.speed })
						else resolve({ data: null, speed: null })
					})
			} else reject(new Error('Path not found'))
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
