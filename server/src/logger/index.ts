import fs from 'fs'
import path from 'path'
import { addColors, createLogger, format, transports } from 'winston'

export const logDir = process.env.PARADISE_LOG_PATH || path.join(__dirname, '../../../../logs')
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const logLevels = {
	levels: {
		error: 0, // Errors that cannot be recovered from - these are crashing the app (e.g. multiple interfaces found)
		warn: 1, // Errors that can be recovered from - the app knows something is up and is working around it (e.g. port 80 not available). This is by default the max level for the debug file logging.
		info: 2, // This is the level that adds a bit more colour around what the logs are showing, e.g. "Server started on port 80"
		history: 3, // This is the level that the history feature users - it's the level that the user can use to run their analytics against. This is the max level that is to be shown to end users.
		debug: 4, // Useful to someone trying to develop the app
		silly: 5, // Quite extreme, logs every single SQL call for example
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		history: 'blue',
		debug: 'black',
		silly: 'black',
	},
}
export const winstonTransports = {
	developerConsole: new transports.Console({
		level: process.env.PARADISE_LOG_LEVEL_CONSOLE || 'debug',
		format: format.combine(format.colorize({ all: true }), format.simple()),
		stderrLevels: ['error'],
		consoleWarnLevels: ['warn'],
	}),
	file: new transports.File({
		// It's quite important to keep file logging to a minimum to avoid stress on the disk (especially a Pi SD card)
		level: process.env.PARADISE_LOG_LEVEL_FILE || 'warn',
		filename: 'error-log.log',
		format: format.combine(
			format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
			format.errors({ stack: true }),
			format.json()
		),
		dirname: logDir,
		tailable: true,
		maxsize: 20971520, //20MB
		maxFiles: 1,
	}),
}
const logger = createLogger({
	levels: logLevels.levels,
	transports: [winstonTransports.file],
	exceptionHandlers: [winstonTransports.file],
	exitOnError: true,
	rejectionHandlers: [winstonTransports.file],
})
addColors(logLevels.colors)

export default logger
