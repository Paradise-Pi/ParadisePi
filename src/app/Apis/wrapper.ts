import { showNotification } from '@mantine/notifications'
import { SocketConnection } from './socketIo'
import { RunningInElectron } from './version'

declare global {
	interface Window {
		ipcApi: {
			send: (
				path: string,
				method: 'GET' | 'POST' | 'PUT' | 'DELETE',
				payload: object,
				callback: (
					success: boolean,
					response: object,
					errorMessage: string | null
				) => void
			) => void
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
		payload: object
	): Promise<object> {
		return new Promise((resolve, reject) => {
			if (RunningInElectron()) {
				window.ipcApi.send(
					path,
					method,
					payload,
					(
						success: boolean,
						response: object,
						errorMessage: string | null
					) => {
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
			} else {
				// Convert the promise chain to a callback because that's what the socket.io lib supports
				SocketConnection.send(
					path,
					method,
					payload,
					(
						success: boolean,
						response: object,
						errorMessage: string | null
					) => {
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
	static get(path: string, payload: object): Promise<ApiResponseObject> {
		return ApiCall.handler(path, 'GET', payload)
	}
	static post(path: string, payload: object): Promise<boolean> {
		return ApiCall.handler(path, 'POST', payload)
			.then(() => true)
			.catch(() => false)
	}
	static put(path: string, payload: object): Promise<ApiResponseObject> {
		return ApiCall.handler(path, 'PUT', payload)
	}
	static delete(path: string, payload: object): Promise<boolean> {
		return ApiCall.handler(path, 'DELETE', payload)
			.then(() => true)
			.catch(() => false)
	}
}
