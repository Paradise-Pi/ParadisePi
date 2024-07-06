import { format, transports } from 'winston'
import { logDir } from '.'
import { BroadcastTransport } from './broadcastTransport'

export const broadcastTransport = new BroadcastTransport({
	level: 'info',
	format: format.combine(format.errors({ stack: true }), format.json()),
})

// Ignore log messages if they have { private: true }
const filterHistoryWrite = format((info, opts) => {
	if (info.level !== 'history')
		return false // Filter out all non-history logs (this is a quirk of how the filtering works anyway)
	else if (
		info.level === 'history' &&
		Array.isArray(opts.historyLogParameters) &&
		info.historyType !== undefined &&
		opts.historyLogParameters.includes(info.historyType) !== true
	)
		// History filter to ignore writing history types if they are not set in the log parameters array
		return false
	else return info
})

export const historyTransport = (historyLogParameters: string[]) =>
	new transports.File({
		level: 'history',
		filename: 'history.log',
		format: format.combine(
			format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
			format.errors({ stack: true }),
			format.json(),
			filterHistoryWrite({ historyLogParameters })
		),
		dirname: logDir,
		tailable: true, // history.log will always be the most recent log file
		maxsize: 20971520, //20MB
		maxFiles: 12,
		zippedArchive: true, // Archive the other 11 files in a zip file
	})
