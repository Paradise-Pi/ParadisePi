import { Database } from '../../../../shared/database'
import { DatabaseFader } from '../../../../shared/sharedTypes'
import { FaderRepository } from '../../database/repository/fader'
import logger from '../../logger'
import { createDatabaseObject, sendDatabaseObject } from '../database'
import { httpMethods } from '../router'
/**
 * This is a REST router for the fader API.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const faderRouter = (path: Array<string>, method: httpMethods, payload: apiObject): Promise<apiObject> => {
	logger.silly('Fader router has a request', { path, method, payload })
	return new Promise((resolve, reject) => {
		if (path[0] === 'log' && path.length === 1 && method === 'POST') {
			logger.log('history', `${payload.name} fader changed`, {
				historyType: 'osc-fader',
				faderAddress: payload.address,
				faderValue: Math.floor(osc.getFaderValue(payload.address) * 100),
				faderId: payload.id,
				faderName: payload.name,
			})
		} else if (method === 'PUT') {
			return FaderRepository.setAllFromApp(payload as Array<DatabaseFader>)
				.then(() => {
					return createDatabaseObject('updating all faders in bulk')
				})
				.then((response: Database) => {
					sendDatabaseObject(response)
					resolve({})
				})
		} else if (method === 'POST') {
			if (payload && typeof payload.address !== undefined && typeof payload.value !== undefined) {
				osc.sendFaderValue(payload.address, payload.value)
				resolve({})
			} else reject(new Error('Payload not sent'))
		} else reject(new Error('Path not found'))
	})
}
