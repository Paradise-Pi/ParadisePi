import { showNotification } from '@mantine/notifications'
import { SocketConnection } from './socketIo'
import { runningInElectron } from './utilities/version'

declare global {
	interface Window {
		ipcApi: {
			send: (
				path: string,
				method: 'GET' | 'POST' | 'PUT' | 'DELETE',
				payload: apiObject,
				callback: (success: boolean, response: apiObject, errorMessage: string | null) => void
			) => void
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			receive: (channel: string, func: any) => void
		}
	}
}

export interface ApiResponseObject {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}
export class ApiCall {
	private static handler(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		payload: apiObject
	): Promise<apiObject> {
		return new Promise((resolve, reject) => {
			if (runningInElectron()) {
				try {
					window.ipcApi.send(
						path,
						method,
						payload,
						(success: boolean, response: apiObject, errorMessage: string | null) => {
							if (success) {
								resolve(response)
							} else {
								showNotification({
									autoClose: 10000,
									message: errorMessage,
									color: 'red',
								})
								reject(new Error(errorMessage))
							}
						}
					)
				} catch (error) {
					showNotification({
						id: 'ipc-error',
						autoClose: false,
						disallowClose: true,
						title: 'IPC Error',
						message: 'Paradise cannot connect to its database. Please restart',
						color: 'red',
					})
					reject(error)
				}
			} else {
				// Convert the promise chain to a callback because that's what the socket.io lib supports
				SocketConnection.send(
					path,
					method,
					payload,
					(success: boolean, response: apiObject, errorMessage: string | null) => {
						if (success) {
							resolve(response)
						} else {
							showNotification({
								autoClose: 10000,
								message: errorMessage,
								color: 'red',
							})
							reject(new Error(errorMessage))
						}
					}
				)
			}
		})
	}
	static get(path: string, payload: apiObject): Promise<ApiResponseObject> {
		return ApiCall.handler(path, 'GET', payload)
	}
	static post(path: string, payload: apiObject): Promise<boolean> {
		return ApiCall.handler(path, 'POST', payload)
			.then(() => true)
			.catch(() => false)
	}
	static put(path: string, payload: apiObject): Promise<ApiResponseObject> {
		return ApiCall.handler(path, 'PUT', payload)
	}
	static delete(path: string, payload: apiObject): Promise<boolean> {
		return ApiCall.handler(path, 'DELETE', payload)
			.then(() => true)
			.catch(() => false)
	}
}
