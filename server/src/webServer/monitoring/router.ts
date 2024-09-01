import axios from 'axios'
import { And, IsNull, Not } from 'typeorm'
import { httpMethods } from '../../api/router'
import dataSource from '../../database/dataSource'
import { Config } from '../../database/model/Config'
import { Device } from '../../database/model/Device'
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
			else return resolve({ statusCode: 500, body: 'OFFLINE', contentType: 'text/plain' })
		} else if (path.startsWith('/monitoring/device')) {
			const deviceId = parseInt(path.split('/').pop())
			if (isNaN(deviceId)) return resolve({ statusCode: 400, body: 'BAD REQUEST', contentType: 'text/plain' })
			// Get device from the database
			return dataSource
				.getRepository(Device)
				.findOne({
					where: {
						id: deviceId,
						statusCheckPath: And(Not(IsNull()), Not('')),
						statusCheckString: And(Not(IsNull()), Not('')),
					},
				})
				.then(device => {
					if (!device) return resolve({ statusCode: 404, body: 'NOT FOUND', contentType: 'text/plain' })
					else {
						let deviceHost = ''
						// Evaluate if there's a device involved that we need to prefix
						if (device !== null && device.id !== null) {
							if (device.ip !== null && device.ip !== '') deviceHost = 'http://' + device.ip
							else if (device.endpoint !== null && device.endpoint !== '') deviceHost = device.endpoint
						}
						if (deviceHost === '')
							return resolve({ statusCode: 500, body: 'NO HOST', contentType: 'text/plain' })
						logger.debug(
							`Checking device status with a call to ${deviceHost}${device.statusCheckPath ?? ''}`,
							{ deviceHost, device }
						)
						return axios
							.get<string>(`${deviceHost}${device.statusCheckPath ?? ''}`, {
								responseType: 'text',
								timeout: 5000, // 5 seconds - we need to be careful not to exceed the timeout on the original request
							})
							.then(response => {
								if (!response)
									return resolve({
										statusCode: 500,
										body: 'OFFLINE',
										contentType: 'text/plain',
									})
								if (!response.data)
									return resolve({
										statusCode: 500,
										body: 'OFFLINE',
										contentType: 'text/plain',
									})
								logger.debug(`Page returned ${response.data} when checking device status`, {
									deviceHost,
								})
								if (response.data.includes(device.statusCheckString))
									return resolve({
										statusCode: 200,
										body: `OK`,
										contentType: 'text/plain',
									})
								else
									return resolve({
										statusCode: 500,
										body: `OFFLINE`,
										contentType: 'text/plain',
									})
							})
							.catch(err => {
								logger.debug(`Get request returned error when checking device status`, {
									err,
								})
								return resolve({ statusCode: 500, body: 'OFFLINE', contentType: 'text/plain' })
							})
					}
				})
		}
		return resolve({ statusCode: 200, body: 'Monitoring endpoint', contentType: 'text/html' })
	})
}
