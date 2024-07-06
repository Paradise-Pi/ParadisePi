import fs from 'fs'
import path from 'path'
import { createLogger, format, transports } from 'winston'

const logDir = process.env.PARADISE_LOG_PATH || path.join(__dirname, '../../../../logs')
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const logLevels = {
	levels: {
		error: 0, // Errors that cannot be recovered from - these are crashing the app (e.g. multiple interfaces found)
		warn: 1, // Errors that can be recovered from - the app knows something is up and is working around it (e.g. port 80 not available). This is by default the max level for the debug file logging.
		info: 2, // This is the level that adds a bit more colour around what the logs are showing, e.g. "Server started on port 80"
		verbose: 3, // This is the level that the history feature users - it's the level that the user can use to run their analytics against. This is the max level that is to be shown to end users.
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
	developerConsole: new transports.Console({
		level: process.env.PARADISE_LOG_LEVEL_CONSOLE || 'debug',
		format: format.combine(
			format.colorize(),
			format.printf(({ level, message, timestamp }) => {
				return `${timestamp} ${level}: ${message}`
			})
		),
		stderrLevels: ['error'],
		consoleWarnLevels: ['warn'],
	}),
	file: new transports.File({
		// It's quite important to keep file logging to a minimum to avoid stress on the disk (especially a Pi SD card)
		level: process.env.PARADISE_LOG_LEVEL_FILE || 'warn',
		filename: 'error-log.log',
		dirname: logDir,
		tailable: true,
		maxsize: 20971520, //20MB
		maxFiles: 1,
	}),
	history: new transports.File({
		level: 'verbose',
		filename: 'history.log',
		dirname: logDir,
		tailable: true, // history.log will always be the most recent log file
		maxsize: 20971520, //20MB
		maxFiles: 12,
		zippedArchive: true, // Archive the other 11 files in a zip file
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
	exceptionHandlers: [winstonTransports.file],
	exitOnError: true,
	rejectionHandlers: [winstonTransports.file],
})

export default logger
