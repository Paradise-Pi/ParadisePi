import { aboutRouter } from './about/aboutRouter'
import { createDatabaseObject } from './database'
import { presetRouter } from './preset/presetRouter'
import { folderRouter } from './folder/folderRouter'
import { configRouter } from './config/configRouter'
import { outputModulesRouter } from './outputModules/outputModulesRouter'
import { reboot } from './../electron/windowUtilities'
import { faderRouter } from './fader/faderRouter'

/**
 * This is a REST router that triages all requests and sends them to relevant routers
 * @param path - The path requested by the requestor
 * @param method - The method requested by the requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export const routeRequest = (
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload: apiObject
): Promise<apiObject> => {
	return new Promise((resolve, reject) => {
		// Split the path into an array of strings
		logger.debug(`Routing request come in to ${path}`, { path, method, payload })
		const pathArr = path.split('/').filter(e => e)
		if (pathArr.length === 0) reject(new Error('Invalid path'))
		switch (pathArr[0]) {
			case 'database':
				// Route is used at first load to get the database object
				return createDatabaseObject('GET database api call').then(response => {
					resolve(response)
				})
			case 'about':
				// {@link aboutRouter} - the about router handles all about requests for the /about path
				resolve(aboutRouter(pathArr.slice(1), method, payload))
				break
			case 'presets':
				// {@link presetRouter} - the preset router handles all about requests for the /presets path
				resolve(presetRouter(pathArr.slice(1), method, payload))
				break
			case 'faders':
				// {@link faderRouter} - the fader router handles all about requests for the /faders path
				resolve(faderRouter(pathArr.slice(1), method, payload))
				break
			case 'folders':
				// {@link folderRouter} - this router handles all about requests for the /folders path
				resolve(folderRouter(pathArr.slice(1), method, payload))
				break
			case 'config':
				// {@link configRouter} - this router handles all about requests for the /config path
				resolve(configRouter(pathArr.slice(1), method, payload))
				break
			case 'outputModules':
				// {@link outputModulesRouter} - this router handles all about requests for the /outputModules path
				resolve(outputModulesRouter(pathArr.slice(1), method, payload))
				break
			case 'reboot':
				reboot(true, false)
				resolve({})
				break
			case 'quit':
				reboot(false, false)
				resolve({})
				break
		}
		reject(new Error('Path not found'))
	})
}
