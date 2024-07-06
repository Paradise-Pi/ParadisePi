import ip from 'ip'
import path from 'path'
import process from 'process'
import 'reflect-metadata'
import { Equal, Or } from 'typeorm'
import dataSource from './database/dataSource'
import { ConfigRepository } from './database/repository/config'
import { broadcastTransport, historyTransport } from './logger/additionalTransports'
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
				if (process.env.NODE_ENV === 'development' || process.env.PARADISE_LOG_LEVEL_CONSOLE) {
					logger.add(winstonTransports.developerConsole) // Turn on console logging if not in production
				}
				logger.info('Booted with database', {
					database: process.env.PARADISE_DATABASE_PATH || path.join(__dirname, '../../../../database.sqlite'),
				})
				return ConfigRepository.find({
					select: { key: true, value: true },
					where: {
						key: Or(Equal('historyEnabled'), Equal('historyLogParameters')),
					},
				})
			})
			.then(historyConfig => {
				if (historyConfig.length !== 2) throw new Error('History configuration not found')
				let historyEnabled = false
				let historyLogParameters: string[] = []
				historyConfig.forEach(config => {
					if (config.key === 'historyEnabled') historyEnabled = config.value === 'true'
					if (config.key === 'historyLogParameters') historyLogParameters = config.value.split(',')
				})
				if (historyEnabled) {
					logger.debug('History logging enabled')
					logger.add(historyTransport(historyLogParameters)) // Turn on history logging
				}
				createE131()
				createOSC()
				setInterval(() => timeClockTriggerRunner(), 20000) // Run every 20 seconds
				return new WebServer()
			})
			.then(() => {
				logger.add(broadcastTransport) // Turn on broadcast logging (for the frontend)
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
		// eslint-disable-next-line no-console
		console.log('[CLI] Paradise Stopping because of user CLI input')
		process.exit()
	})
	process.on('exit', () => {
		// eslint-disable-next-line no-console
		console.log('[CLI] Paradise Stopped')
	})
}
