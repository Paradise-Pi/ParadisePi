import 'reflect-metadata'
import dataSource from './database/dataSource'
import logger, { winstonTransports } from './logger/index'
import { createE131 } from './output/e131/constructor'
import { createOSC } from './output/osc/constructor'
import { timeClockTriggerRunner } from './timeClockTriggerRunner'
import { WebServer } from './webServer'

export const startParadise = () => {
	const bootData = {}
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
				new WebServer()
				logger.add(winstonTransports.broadcast) // You can only add the broadcast transport once the webserver has started
				logger.profile('boot', { level: 'debug', message: 'Boot Timer' })
				resolve(bootData)
			})
			.catch(err => {
				// Error during Data Source initialization Error: Cannot find module 'undefinedbuild/Release/better_sqlite3.node'  =  https://github.com/electron-userland/electron-forge/issues/2412
				logger.error('Error during Data Source initialization', { err })
				throw err
			})
	})
}
console.log('here')
if (require.main === module) {
	console.log('here2')
	startParadise()
	console.log('here3')
	// eslint-disable-next-line no-constant-condition
	while (true) {
		continue
	}
}
