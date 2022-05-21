import { DatabasePreset, PresetRepository } from './../database/repository/preset'
import { aboutRouter } from './about/router'
import { createDatabaseObject, Database, sendDatabaseObject } from './database'

export const routeRequest = (
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	return new Promise((resolve, reject) => {
		const pathArr = path.split('/').filter(e => e)
		if (pathArr.length === 0) reject(new Error('Invalid path'))
		switch (pathArr[0]) {
			case 'ping':
				resolve({
					...payload,
					message: 'pong',
					method,
					time: Date.now(),
				})
				break
			case 'database':
				return createDatabaseObject('GET database api call').then(response => {
					resolve(response)
				})
				break
			case 'about':
				resolve(aboutRouter(pathArr.slice(1), method, payload))
				break
			case 'presets':
				if (method === 'PUT') {
					return PresetRepository.setAll(payload as Array<DatabasePreset>)
						.then(() => {
							return createDatabaseObject('updating all presets in bulk')
						})
						.then((response: Database) => {
							sendDatabaseObject(response)
							resolve({})
						})
					break
				}
		}
		reject(new Error('Path not found'))
	})
}
