import Transport from 'winston-transport'
import { WebServer } from './../webServer'
/**
 * Custom transport for Winston that sends logs to the frontend using either the socket or the IPC
 */
export class BroadcastTransport extends Transport {
	constructor(opts: Transport.TransportStreamOptions) {
		super(opts)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	log(info: string, callback: () => void) {
		setImmediate(() => {
			this.emit('logged', info)
		})

		mainBrowserWindow.webContents.send('logging', info)
		WebServer.socketIo.emit('logging', info)

		callback()
	}
}
