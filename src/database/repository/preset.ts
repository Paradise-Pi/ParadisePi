import { parseJSON } from './../../api/parseUserJson'
import { In, Not } from 'typeorm'
import dataSource from './../dataSource'
import { Preset } from './../model/Preset'

export type PresetTypes = 'e131' | 'osc' | 'http' | 'macro'
export interface DatabasePreset {
	id: number
	name: string
	enabled: boolean
	icon?: string | null
	type?: PresetTypes
	universe?: string | null
	fadeTime?: number
	data?: string | null
	timeClockTriggers?: string | null
	httpTriggerEnabled: boolean
	folderId?: string // An unfortunate feature of the mantine select is that it requires a string instead of a number :(
	color?: string
}
export interface TimeClockTrigger {
	presetId: number
	time: string
	enabled: boolean
	timeout: number
	countdownWarning: number
	countdownWarningText: string
}

export const PresetRepository = dataSource.getRepository(Preset).extend({
	//get one preset
	getItem(key: string): string | null {
		const item = this.findOne({
			select: {
				value: true,
			},
			where: {
				key,
			},
		})
		if (!item) return null
		else return item.value
	},
	//get all presets
	async getAll(): Promise<Array<DatabasePreset>> {
		const items = await this.find()
		return items.map((item: Preset) => {
			return {
				id: item.id,
				name: item.name,
				enabled: item.enabled,
				type: item.type,
				icon: item.icon !== null ? item.icon : null,
				universe: item.universe,
				fadeTime: item.fadeTime !== null ? item.fadeTime : 0,
				data: item.data !== null ? JSON.stringify(item.data) : null,
				timeClockTriggers: item.timeClockTriggers !== null ? JSON.stringify(item.timeClockTriggers) : null,
				httpTriggerEnabled: item.httpTriggerEnabled,
				folderId: item.folder !== null ? item.folder.id.toString() : null,
				color: item.color !== null ? item.color : '#2C2E33',
			}
		})
	},
	/**
	 * Delete all existing presets and then upload the given presets
	 * @param presets - An array of presets to set as the database record
	 */
	async setAllFromApp(presets: Array<DatabasePreset>): Promise<void> {
		const presetIdsToKeep: Array<number> = presets
			.filter((preset: DatabasePreset) => preset.id !== null)
			.map((preset: DatabasePreset) => preset.id)
		await this.delete({
			id: Not(In(presetIdsToKeep)),
		})
		// Convert preset back to an object
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const presetsToInsert: Array<{ [key: string]: any }> = presets.map((preset: DatabasePreset, count: number) => {
			return {
				...preset,
				sort: count + 10, // +10 to make sure that newly inserted ones with null/0/1 end up at the top
				universe: preset.universe !== null ? parseInt(preset.universe) : null,
				folder: preset.folderId !== null ? parseInt(preset.folderId) : null,
				data: preset.data !== null && preset.data.length > 0 ? parseJSON(preset.data) : null,
				timeClockTriggers:
					preset.timeClockTriggers !== null && preset.timeClockTriggers.length > 0
						? parseJSON(preset.timeClockTriggers)
						: null,
			}
		})
		await this.upsert(presetsToInsert, ['id'])
	},
})
