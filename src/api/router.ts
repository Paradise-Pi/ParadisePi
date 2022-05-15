import { aboutRouter } from './about/router'
import { sendDatabaseObject, createDatabaseObject } from './database'

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
			case 'refreshDatabase':
				//TODO remove - this is just a POC
				sendDatabaseObject(
					createDatabaseObject('from the refresh command')
				)
				resolve({})
				break
			case 'getDatabase':
				resolve(createDatabaseObject('from the getDatabase command'))
				break
			case 'about':
				resolve(aboutRouter(pathArr.slice(1), method, payload))
				break
		}
		reject(new Error('Path not found'))
	})
}
