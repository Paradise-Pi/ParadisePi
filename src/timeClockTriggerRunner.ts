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
			timeClockTriggers.forEach(timeClockTrigger => {
				const timeClockTriggerTimeStamp = new Date(
					Date.parse(date.toISOString().split('T')[0] + ' ' + timeClockTrigger.time + ':00')
				).valueOf()
				if (
					currentTimeStamp >= timeClockTriggerTimeStamp && // Time is now after the trigger time
					currentTimeStamp <= timeClockTriggerTimeStamp + timeClockTrigger.timeout * 60 * 1000 && //Time is before the timeout
					timeClockTrigger.lastTriggered < timeClockTriggerTimeStamp // Last triggered is before the trigger time
				) {
					TimeClockTriggersRepository.update(timeClockTrigger.id, {
						lastTriggered: currentTimeStamp,
					}).then(() => {
						if (!locked || timeClockTrigger.enabledWhenLocked) {
							logger.log('verbose', 'Triggering time clock trigger', { timeClockTrigger })
							presetRouter(['recall', timeClockTrigger.presetId.toString()], 'GET', {})
						}
					})
				}
			})
		})
}
