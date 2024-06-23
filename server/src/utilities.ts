import fs from 'fs'
import dataSource from './database/dataSource'
const destroyDatabaseIfExists = (): Promise<void> => {
	return new Promise<void>(resolve => {
		if (dataSource.isInitialized) return dataSource.destroy().then(resolve)
		else return resolve()
	})
}
export const reboot = (reboot?: boolean, force?: boolean, flagsAdd?: Array<string>, flagsRemove?: Array<string>) => {
	if (!flagsAdd) {
		flagsAdd = []
	}
	if (!flagsRemove) {
		flagsRemove = []
	}
	destroyDatabaseIfExists().then(() => {
		logger.close() // Otherwise corrupts logfile
		if (reboot) {
			let flags = process.argv.slice(1)
			flagsRemove.forEach(flagRemove => {
				flags = flags.filter(item => item !== flagRemove)
			})
			flags = flags.concat(flagsAdd)
			// TODO write a rebooot process
			process.exit(0)
		}
		if (force || typeof force === 'undefined') {
			// Default to forcing it
			process.exit(0)
		} else {
			process.exit(0)
		}
	})
}

export const factoryReset = () => {
	dataSource.destroy().then(() => {
		fs.unlink('database.sqlite', err => {
			if (err) throw err
			reboot(true, false)
		})
	})
}
