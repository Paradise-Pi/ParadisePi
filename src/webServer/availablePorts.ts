import portfinder from 'portfinder'
/**
 * Get an available port to use for the web server on the local machine to serve requests to paradise.
 * @returns - a port to use for the web server that's available
 */
export const getAvailablePort = (): Promise<number> => {
	let desiredPort = process.env.WEB_SERVER_PORT ? parseInt(process.env.WEB_SERVER_PORT) : 80
	if (desiredPort > 65535 || desiredPort < 1) desiredPort = 80
	return portfinder
		.getPortPromise({
			port: desiredPort,
			stopPort: 65535,
		})
		.then(port => {
			return port
		})
		.catch(err => {
			throw err
		})
}
