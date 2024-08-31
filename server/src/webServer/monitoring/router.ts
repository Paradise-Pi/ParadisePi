import { httpMethods } from '../../api/router'
import dataSource from '../../database/dataSource'
import { Config } from '../../database/model/Config'
import logger from '../../logger'
/**
 * This is a REST router for the monitoring endpoints available over HTTP.
 * @param path - The path requested by the original route requestor
 * @param method - The method requested by the original route requestor
 * @param payload - Any payload sent
 * @returns the retrieved response from the given route
 * @throws an error if the requested route is not found
 */
export interface monitoringApiResponse {
	statusCode: number
	contentType: 'text/html' | 'application/json' | 'text/plain'
	body: string
}
export const monitoringRouter = (path: string, method: httpMethods): Promise<monitoringApiResponse> => {
	logger.silly('Monitoring HTTP endpoint router has a request', { path, method })
	return new Promise((resolve, reject) => {
		if (path.startsWith('/monitoring/database')) {
			// Generic endpoint which can be used for checking if the database is connected and things are therefore broadly okay
			return dataSource
				.getRepository(Config)
				.createQueryBuilder('config')
				.getCount()
				.then(count => {
					if (count > 0)
						return resolve({
							statusCode: 200,
							body: `OK`,
							contentType: 'text/plain',
						})
					else return resolve({ statusCode: 500, body: 'ERROR', contentType: 'text/plain' })
				})
		} else if (path.startsWith('/monitoring/osc')) {
			if (!globalThis.osc) return resolve({ statusCode: 404, body: 'NOT ENABLED', contentType: 'text/plain' })
			const datastore = globalThis.osc.getDatastore()
			if (datastore.status === true)
				return resolve({
					statusCode: 200,
					body: `OK`,
					contentType: 'text/plain',
				})
			else return resolve({ statusCode: 500, body: 'ERROR', contentType: 'text/plain' })
		}
		return resolve({ statusCode: 200, body: 'Monitoring endpoint', contentType: 'text/html' })
	})
}
