import net from 'net'
import logger from '../../logger'
export const tcpRequest = async (host: string, port: number, data: string, timeout: number) =>
	new Promise<{
		data: string
		speed: number
	}>((resolve, reject) => {
		if (isNaN(timeout) || timeout > 60 || timeout < 0) {
			timeout = 60 // Max timeout of 60 seconds
		}
		logger.debug('Making TCP request', { host, port, data, timeout })
		const start = Date.now()
		const client = new net.Socket()
		setTimeout(() => {
			logger.debug('TCP Request timed out', { host, port, data, timeout })
			client.destroy()
			reject(`Request timed out after ${timeout} seconds`)
		}, timeout * 1000)
		client.connect(port, host, () => {
			client.write(Buffer.from(data, 'hex'))
			logger.debug('Sent data to TCP server ' + host, { data })
		})
		client.on('close', () => {
			client.destroy()
			resolve({ data: null, speed: Date.now() - start })
		})
		client.on('data', data => {
			logger.debug('Received data from TCP server ' + host, { data: data.toString('hex') })
			client.destroy()
			resolve({ data: data.toString('hex'), speed: Date.now() - start })
		})
		client.on('error', error => {
			logger.debug('Received error from TCP server ' + host, error)
			client.destroy()
			reject(error.message)
		})
	})
