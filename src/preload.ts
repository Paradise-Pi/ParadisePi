import { contextBridge, ipcRenderer } from 'electron'
import { IpcRequest } from './api/ipc'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('ipcApi', {
	send: (
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		payload: apiObject,
		callback: (
			success: boolean,
			response: apiObject,
			errorMessage: string | null
		) => void
	) => {
		ipcRenderer
			.invoke('apiCall', { path, method, payload } as IpcRequest)
			.then(result => {
				callback(result.success, result.response, result.errorMessage)
			})
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	receive: (channel: string, func: any) => {
		const validChannels = ['refreshDatabase']
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => func(...args))
		}
	},
})
