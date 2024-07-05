import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dataSource from './database/dataSource'
import logger from './logger'
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
			sendRebootCommand()
		}
		if (force || typeof force === 'undefined') {
			// Default to forcing it
			sendRebootCommand()
		} else {
			sendRebootCommand()
		}
	})
}

export const factoryReset = () => {
	dataSource.destroy().then(() => {
		fs.unlink(process.env.PARADISE_DATABASE_PATH || path.join(__dirname, '../../database.sqlite'), err => {
			if (err) throw err
			reboot(true, false)
		})
	})
}

const sendRebootCommand = () => {
	if (process.env.BALENA_SUPERVISOR_ADDRESS && process.env.BALENA_SUPERVISOR_API_KEY) {
		balenaSupervisorApiReboot()
	} else process.exit(0)
}
const balenaSupervisorApiReboot = () => {
	console.log('Rebooting device via balena supervisor API')
	return axios({
		method: 'POST',
		url: `${process.env.BALENA_SUPERVISOR_ADDRESS}/v1/reboot?apikey=${process.env.BALENA_SUPERVISOR_API_KEY}`,
		data: { 'force ': true },
		timeout: 2000, // 2 seconds
	}).then(() => {
		// Cannot use logger here because it will be closed
		console.log('Reboot request sent to balena')
		return
	})
}
