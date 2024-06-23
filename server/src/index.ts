import ip from 'ip'
import process from 'process'
import 'reflect-metadata'
import dataSource from './database/dataSource'
import { BroadcastTransport } from './logger/broadcastTransport'
import logger, { winstonTransports } from './logger/index'
import { createE131 } from './output/e131/constructor'
import { createOSC } from './output/osc/constructor'
import { timeClockTriggerRunner } from './timeClockTriggerRunner'
import { WebServer } from './webServer'

export const startParadise = (): Promise<{ port: number; ip: string }> => {
	return new Promise(resolve => {
		dataSource
			.initialize()
			.then(() => {
				logger.profile('boot')
				if (process.env.NODE_ENV !== 'production') {
					logger.add(winstonTransports.console) // Turn on console logging if not in production
				}
				createE131()
				createOSC()
				setInterval(() => timeClockTriggerRunner(), 20000) // Run every 20 seconds
				return new WebServer()
			})
			.then(() => {
				logger.add(
					new BroadcastTransport({
						level: 'verbose',
					})
				) // Turn on broadcast logging (for the frontend)
				logger.profile('boot', { level: 'debug', message: 'Boot Timer' })
				resolve({ port: WebServer.port, ip: ip.address() })
			})
			.catch(err => {
				// Error during Data Source initialization Error: Cannot find module 'undefinedbuild/Release/better_sqlite3.node'  =  https://github.com/electron-userland/electron-forge/issues/2412
				logger.error('Error during Data Source initialization', { err })
				throw err
			})
	})
}
if (require.main === module) {
	// eslint-disable-next-line no-console
	console.log('[CLI] Starting Paradise')
	startParadise().then(data => {
		// eslint-disable-next-line no-console
		console.log(`[CLI] Paradise Running on ${data.ip}:${data.port}`)
	})
	process.stdin.resume() // Keep the process alive
	process.on('SIGINT', () => {
		process.exit()
	})
}
