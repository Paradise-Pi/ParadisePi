import { io, Socket } from 'socket.io-client'
import { Database } from '../../api/database'
import { ClientToServerEvents, ServerToClientEvents } from '../../api/socketIo'
import { setFromNode } from './databaseSlice'
import store, { useAppDispatch } from './mainStore'

export class SocketConnection {
	private static socket:
		| Socket<ServerToClientEvents, ClientToServerEvents>
		| false = false
	static send(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		payload: object,
		callback: (
			success: boolean,
			response: object,
			errorMessage: string | null
		) => void
	) {
		if (!SocketConnection.socket) {
			console.log('Opening socket connection')
			SocketConnection.socket = io({
				autoConnect: true,
			})
			SocketConnection.socket.on(
				'refreshDatabase',
				(database: Database) => {
					store.dispatch(setFromNode(database))
				}
			)
		}

		SocketConnection.socket.emit('apiCall', path, method, payload, callback)
	}
}
