import { presetRouter } from './api/preset/presetRouter'
import { ConfigRepository } from './database/repository/config'
import { TimeClockTriggersRepository } from './database/repository/timeClockTrigger'
import logger from './logger/index'
export const timeClockTriggerRunner = () => {
	const date = new Date()
	let locked = false
	const dayOfWeek = ['sun', 'mon', 'tues', 'weds', 'thurs', 'fri', 'sat'][date.getDay()]
	const currentTimeStamp = date.valueOf()
	ConfigRepository.getItem('deviceLock')
		.then(deviceLock => {
			if (deviceLock === 'LOCKED') {
				locked = true
			}
			return TimeClockTriggersRepository.getToRun(dayOfWeek)
		})
		.then(timeClockTriggers => {
			console.log(timeClockTriggers)
			timeClockTriggers.forEach(timeClockTrigger => {
				const timeClockTriggerTimeStamp = new Date(
					Date.parse(date.toISOString().split('T')[0] + ' ' + timeClockTrigger.time + ':00 +0000')
				).valueOf()
				console.log(
					date.toISOString().split('T')[0] + timeClockTrigger.time + '00:+0000',
					timeClockTriggerTimeStamp,
					timeClockTriggerTimeStamp > currentTimeStamp,
					timeClockTriggerTimeStamp + timeClockTrigger.timeout * 60 * 1000 < currentTimeStamp,
					timeClockTrigger.lastTriggered < timeClockTriggerTimeStamp
				)
				if (
					timeClockTriggerTimeStamp > currentTimeStamp &&
					timeClockTriggerTimeStamp + timeClockTrigger.timeout * 60 * 1000 < currentTimeStamp &&
					timeClockTrigger.lastTriggered < timeClockTriggerTimeStamp
				) {
					TimeClockTriggersRepository.update(timeClockTrigger.id, {
						lastTriggered: currentTimeStamp,
					}).then(() => {
						if (!locked || timeClockTrigger.enabledWhenLocked) {
							logger.log('verbose', 'Triggering time lock trigger', { timeClockTrigger })
							presetRouter(['recall', timeClockTrigger.presetId.toString()], 'GET', {})
						}
					})
				}
			})
		})
}
