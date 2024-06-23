import { io, Socket } from 'socket.io-client'
import { Images } from '../../shared/sharedTypes'
import { ClientToServerEvents, ServerToClientEvents } from '../../shared/socketIo'
import { setFromNode } from './redux/databaseSlice'
import { setFromAPI } from './redux/e131SamplingModeSlice'
import { refreshImagesDatastore } from './redux/imagesSlice'
import { appendLogline } from './redux/logsSlice'
import store from './redux/mainStore'
import { updateOSCDatastore } from './redux/oscDataSlice'
import { setSocketClients, setSocketPasswordRequired, setSocketStatusConnection } from './redux/statusSlice'
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
			const serverAddress = sessionStorage.getItem('paradiseServerAddress') || window.location.host
			SocketConnection.socket = io(serverAddress, {
				autoConnect: true,
				query: {
					os: getOS(),
				},
				auth: cb => {
					if (
						sessionStorage.getItem('paradiseRemotePassword') &&
						sessionStorage.getItem('paradiseRemotePassword') != null
					) {
						cb({
							password: sessionStorage.getItem('paradiseRemotePassword'),
						})
					} else cb({ password: null })
				},
			})

			SocketConnection.socket.on('connect', () => {
				store.dispatch(setSocketStatusConnection(true))
				store.dispatch(setSocketPasswordRequired(false))
			})
			SocketConnection.socket.on('connect_error', error => {
				if (error.message === 'Password incorrect') {
					store.dispatch(setSocketPasswordRequired(true))
				} else {
					store.dispatch(setSocketStatusConnection(false))
				}
			})
			SocketConnection.socket.on('disconnect', () => {
				store.dispatch(setSocketStatusConnection(false))
			})
			SocketConnection.socket.io.on('reconnect', () => {
				store.dispatch(setSocketStatusConnection(true))
			})

			SocketConnection.socket.on('refreshDatabase', database => {
				store.dispatch(setFromNode(database))
			})
			SocketConnection.socket.on('refreshImagesDatastore', (data: Images) => {
				store.dispatch(refreshImagesDatastore(data))
			})
			SocketConnection.socket.on('logging', message => {
				store.dispatch(appendLogline(JSON.stringify(message)))
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
	static disconnect() {
		if (SocketConnection.socket) {
			SocketConnection.socket.disconnect()
			SocketConnection.socket = false
		}
	}
}
