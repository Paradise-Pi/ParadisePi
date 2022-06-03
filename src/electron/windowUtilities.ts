import dataSource from './../database/dataSource'
import { app } from 'electron'
import fs from 'fs'

export const reboot = (reboot?: boolean, force?: boolean, flagsAdd?: Array<string>, flagsRemove?: Array<string>) => {
	if (!flagsAdd) {
		flagsAdd = []
	}
	if (!flagsRemove) {
		flagsRemove = []
	}
	dataSource.destroy().then(() => {
		if (reboot) {
			let flags = process.argv.slice(1)
			flagsRemove.forEach(flagRemove => {
				flags = flags.filter(item => item !== flagRemove)
			})
			flags = flags.concat(flagsAdd)
			app.relaunch({ args: flags })
		}
		if (force || typeof force === 'undefined') {
			// Default to forcing it
			app.exit(0)
		} else {
			app.quit()
		}
	})
}

export const factoryReset = () => {
	dataSource.destroy().then(() => {
		fs.unlink('database.sqlite', err => {
			if (err) throw err
			reboot(true)
		})
	})
}
