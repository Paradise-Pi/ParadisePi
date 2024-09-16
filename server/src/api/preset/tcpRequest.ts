import net from 'net'
import logger from '../../logger'
export const tcpRequest = async (host: string, port: number, data: string, timeout: number) =>
	new Promise<void>((resolve, reject) => {
		if (isNaN(timeout) || timeout > 60 || timeout < 0) {
			timeout = 60 // Max timeout of 60 seconds
		}
		logger.debug('Making TCP request', { host, port, data, timeout })
		const client = new net.Socket()
		const connectionTimeout = setTimeout(() => {
			logger.debug('TCP Request timed out', { host, port, data, timeout })
			client.destroy()
		}, timeout * 1000)
		client.connect(port, host, () => {
			clearTimeout(connectionTimeout) // Prevent connectionTimeout from running now that we are connected
			client.write(Buffer.from(data, 'hex'))
			logger.debug('Sent data to TCP server ' + host, { data })
			client.destroy()
		})
		client.on('close', () => {
			client.destroy()
			resolve()
		})
		client.on('data', data => {
			logger.debug('Received data from TCP server ' + host, { data: data.toString('hex') })
			client.destroy()
		})
		client.on('error', error => {
			logger.debug('Received error from TCP server ' + host, error)
			client.destroy()
			reject()
		})
	})
