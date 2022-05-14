import { contextBridge, ipcRenderer } from 'electron'
import { IpcRequest } from './api/ipc'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('ipcApi', {
	send: (
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		payload: object,
		callback: (
			success: boolean,
			response: object,
			errorMessage: string | null
		) => void
	) => {
		ipcRenderer
			.invoke('apiCall', { path, method, payload } as IpcRequest)
			.then(result => {
				callback(result.success, result.response, result.errorMessage)
			})
	},
})
