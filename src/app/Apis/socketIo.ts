import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '../../api/socketIo'
import { setFromNode } from './databaseSlice'
import store from './mainStore'

export class SocketConnection {
	private static socket: Socket<ServerToClientEvents, ClientToServerEvents> | false = false
	static send(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		payload: apiObject,
		callback: (success: boolean, response: apiObject, errorMessage: string | null) => void
	) {
		if (!SocketConnection.socket) {
			console.log('Opening socket connection')
			SocketConnection.socket = io({
				autoConnect: true,
			})
			SocketConnection.socket.on('refreshDatabase', database => {
				store.dispatch(setFromNode(database))
			})
			SocketConnection.socket.on('logging', message => {
				console.log(message)
			})
			SocketConnection.socket.on('disconnect', reason => {
				console.log('Socket disconnected' + reason)
			})
		}

		SocketConnection.socket.emit('apiCall', path, method, payload, callback)
	}
}
