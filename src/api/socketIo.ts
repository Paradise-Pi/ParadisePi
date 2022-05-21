/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Docs for this file are at https://socket.io/docs/v4/typescript/
 */

import { Database } from './database'

export interface ServerToClientEvents {
	refreshDatabase: (database: Database) => void
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
