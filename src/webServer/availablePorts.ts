import portastic from 'portastic'
/**
 * Get an available port to use for the web server on the local machine to serve requests to paradise.
 * @returns - a port to use for the web server that's available
 */
export const getAvailablePort = (): Promise<number> => {
	const desiredPort = process.env.WEB_SERVER_PORT ? parseInt(process.env.WEB_SERVER_PORT) : 80
	return new Promise((resolve, reject) => {
		return portastic.test(desiredPort).then(function (isOpen) {
			if (isOpen) resolve(desiredPort)
			else {
				return portastic
					.find({ min: desiredPort, max: desiredPort + 20, retrieve: 1 })
					.then(function (ports) {
						if (ports.length > 0) resolve(ports[0])
						else {
							return portastic
								.find({ min: 8080, max: 8999, retrieve: 1 })
								.then(function (ports) {
									if (ports.length > 0) resolve(ports[0])
									else reject('No ports available')
								})
								.catch(function (err) {
									reject(err)
								})
						}
					})
					.catch(function (err) {
						reject(err)
					})
			}
		})
	})
}
