/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Docs for this file are at https://socket.io/docs/v4/typescript/
 */

import { Database } from './database'
import { Images } from './sharedTypes'

export interface ServerToClientEvents {
	refreshDatabase: (database: Database) => void
	refreshImagesDatastore: (images: Images) => void
	oscDatastoreUpdate: (message: any) => void
	logging: (message: { [key: string]: any }) => void
	socketClients: (message: { [key: string]: any }) => void
	e131SamplingMode: (message: { messageType: string; status?: boolean; duration?: number; message: string }) => void
}

export interface ClientToServerEvents {
	apiCall: (
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		payload: apiObject,
		callback: (success: boolean, response: apiObject, errorMessage: string | null) => void
	) => void
}

export interface InterServerEvents {}

export interface SocketData {}
