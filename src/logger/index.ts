import { createLogger, format, transports } from 'winston'
import { BroadcastTransport } from './broadcastTransport'
import fs from 'fs'
import path from 'path'
import { isRunningInDevelopmentMode } from './../electron/developmentMode'

const logDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const logLevels = {
	levels: {
		error: 0, // Errors that cannot be recovered from - these are crashing the app (e.g. multiple interfaces found)
		warn: 1, // Errors that can be recovered from - the app knows something is up and is working around it (e.g. port 80 not available)
		info: 2, // Information that is useful to know - the app is working as expected and started
		verbose: 3, // As above, but with a bit more detail - e.g. actions taken and requests made. MAX LEVEL SHOWN TO USERS IN UI
		debug: 4, // Useful to someone trying to develop the app
		silly: 5, // Quite extreme, logs every single SQL call for example
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
	},
}
export const winstonTransports = {
	console: new transports.Console({
		level: isRunningInDevelopmentMode ? 'verbose' : 'debug',
		format: format.json(),
	}),
	file: new transports.File({
		// It's quite important to keep file logging to a minimum to avoid stress on the disk (especially a Pi SD card)
		level: 'warn',
		filename: 'log.log',
		dirname: logDir,
		tailable: true,
		maxsize: 20971520, //20MB
		maxFiles: 1,
	}),
	broadcast: new BroadcastTransport({
		level: 'verbose',
	}),
}
const logger = createLogger({
	levels: logLevels.levels,
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [winstonTransports.file],
	exceptionHandlers: isRunningInDevelopmentMode ? [] : [winstonTransports.file],
	exitOnError: true,
	rejectionHandlers: isRunningInDevelopmentMode ? [] : [winstonTransports.file],
})

export default logger
