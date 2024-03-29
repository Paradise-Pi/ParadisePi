import { broadcast } from './../api/broadcast'
import Transport from 'winston-transport'
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

		broadcast('logging', { info })

		callback()
	}
}
