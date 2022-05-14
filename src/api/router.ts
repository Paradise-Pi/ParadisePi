import { sendDatabaseObject, createDatabaseObject } from './database'

export const routeRequest = (
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: object
): Promise<object> => {
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
				sendDatabaseObject(
					createDatabaseObject('from the refresh command')
				)
				resolve({})
				break
			case 'getDatabase':
				resolve(createDatabaseObject('from the getDatabase command'))
				break
		}
		reject(new Error('Path not found'))
	})
}
