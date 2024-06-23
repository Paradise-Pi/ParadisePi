import Transport from 'winston-transport'
import { broadcast } from '../api/broadcast'
/**
 * Custom transport for Winston that sends logs to the frontend using the socket
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
