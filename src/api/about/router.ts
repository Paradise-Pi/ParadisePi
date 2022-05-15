import { getOperatingSystemUsage } from './operatingSystem/usage'

export const aboutRouter = (
	path: Array<string>,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	return new Promise((resolve, reject) => {
		if (path.length === 0) reject(new Error('Invalid path'))
		switch (path[0]) {
			case 'operatingSystemUsage':
				return getOperatingSystemUsage().then(response => {
					resolve(response as unknown as apiObject)
				})
				break
		}
		reject(new Error('Path not found'))
	})
}
