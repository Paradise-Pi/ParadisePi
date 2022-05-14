import { contextBridge, ipcRenderer } from 'electron'
import { Database } from './api/database'
import { IpcRequest } from './api/ipc'
import { setFromNode } from './app/Apis/databaseSlice'
import store from './app/Apis/mainStore'

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
	receive: (channel: string, func: any) => {
		const validChannels = ['refreshDatabase']
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => func(...args))
		}
	},
})
