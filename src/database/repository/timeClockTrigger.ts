import { In, Not } from 'typeorm'
import dataSource from '../dataSource'
import { TimeClockTrigger } from '../model/TimeClockTrigger'

export interface DatabaseTimeClockTrigger {
	id: number
	presetId: string // An unfortunate feature of the mantine select is that it requires a string instead of a number :(
	time: string
	notes: string
	enabled: boolean
	enabledWhenLocked: boolean
	timeout: number
	countdownWarning: number // TODO implement
	countdownWarningText: string // TODO implement

	lastTriggeredString: string

	mon: boolean
	tues: boolean
	weds: boolean
	thurs: boolean
	fri: boolean
	sat: boolean
	sun: boolean
}

export const TimeClockTriggersRepository = dataSource.getRepository(TimeClockTrigger).extend({
	async getAll(): Promise<Array<DatabaseTimeClockTrigger>> {
		const items = await this.find()
		return items.map((item: TimeClockTrigger) => {
			return {
				id: item.id,
				time: item.time,
				notes: item.notes,
				presetId: item.preset !== null ? item.preset.id.toString() : null,
				enabled: item.enabled,
				enabledWhenLocked: item.enabledWhenLocked,
				timeout: item.timeout,
				countdownWarning: item.countdownWarning,
				countdownWarningText: item.countdownWarningText,
				lastTriggeredString:
					item.lastTriggered !== null && item.lastTriggered > 0
						? new Date(item.lastTriggered).toString()
						: '',
				mon: item.mon,
				tues: item.tues,
				weds: item.weds,
				thurs: item.thurs,
				fri: item.fri,
				sat: item.sat,
				sun: item.sun,
			}
		})
	},
	async getToRun(dayOfWeek: string): Promise<
		Array<{
			id: number
			time: string
			presetId: number
			timeout: number
			enabledWhenLocked: boolean
			lastTriggered: number
		}>
	> {
		const items = await this.find({
			select: {
				id: true,
				time: true,
				preset: true,
				timeout: true,
				enabledWhenLocked: true,
				lastTriggered: true,
			},
			where: {
				enabled: true,
				...(dayOfWeek === 'mon' && { mon: true }),
				...(dayOfWeek === 'tues' && { tues: true }),
				...(dayOfWeek === 'weds' && { weds: true }),
				...(dayOfWeek === 'thurs' && { thurs: true }),
				...(dayOfWeek === 'fri' && { fri: true }),
				...(dayOfWeek === 'sat' && { sat: true }),
				...(dayOfWeek === 'sun' && { sun: true }),
			},
			order: {
				time: 'ASC',
			},
		})
		return items.map((item: TimeClockTrigger) => {
			return {
				id: item.id,
				time: item.time,
				timeout: item.timeout,
				enabledWhenLocked: item.enabledWhenLocked,
				lastTriggered: item.lastTriggered,
				presetId: item.preset !== null ? item.preset.id : null,
			}
		})
	},
	async setAllFromApp(timeClockTriggers: Array<DatabaseTimeClockTrigger>): Promise<void> {
		const idsToKeep: Array<number> = timeClockTriggers
			.filter((trigger: DatabaseTimeClockTrigger) => trigger.id !== null)
			.map((trigger: DatabaseTimeClockTrigger) => trigger.id)
		await this.delete({
			id: Not(In(idsToKeep)),
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const toInsert: Array<{ [key: string]: any }> = timeClockTriggers.map((trigger: DatabaseTimeClockTrigger) => {
			const presetId = trigger.presetId !== null ? parseInt(trigger.presetId) : null
			delete trigger.presetId
			delete trigger.lastTriggeredString
			return {
				...trigger,
				preset: presetId,
				countdownWarning: 0,
				countdownWarningText: '',
			}
		})
		await this.upsert(toInsert, ['id'])
	},
})
