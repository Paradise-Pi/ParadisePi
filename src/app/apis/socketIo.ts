import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from './../../api/socketIo'
import { setFromNode } from './redux/databaseSlice'
import { setFromAPI } from './redux/e131SamplingModeSlice'
import { appendLogline } from './redux/logsSlice'
import store from './redux/mainStore'
import { updateOSCDatastore } from './redux/oscDataSlice'
import { setSocketClients, setSocketStatusConnection } from './redux/statusSlice'
import { getOS } from './utilities/os'

export class SocketConnection {
	private static socket: Socket<ServerToClientEvents, ClientToServerEvents> | false = false
	static send(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		payload: apiObject,
		callback: (success: boolean, response: apiObject, errorMessage: string | null) => void
	) {
		if (!SocketConnection.socket) {
			SocketConnection.socket = io({
				autoConnect: true,
				query: {
					os: getOS(),
				},
			})
			SocketConnection.socket.on('refreshDatabase', database => {
				store.dispatch(setFromNode(database))
			})
			SocketConnection.socket.on('logging', message => {
				store.dispatch(appendLogline(JSON.stringify(message)))
			})
			SocketConnection.socket.on('connect', () => {
				store.dispatch(setSocketStatusConnection(true))
			})
			SocketConnection.socket.on('disconnect', () => {
				store.dispatch(setSocketStatusConnection(false))
			})
			SocketConnection.socket.on('socketClients', clients => {
				store.dispatch(setSocketClients(clients))
			})
			SocketConnection.socket.on('e131SamplingMode', message => {
				store.dispatch(setFromAPI(message))
			})
			SocketConnection.socket.on('oscDatastoreUpdate', database => {
				store.dispatch(updateOSCDatastore(database))
			})
		}

		SocketConnection.socket.emit('apiCall', path, method, payload, callback)
	}
}