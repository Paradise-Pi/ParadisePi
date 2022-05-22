import dataSource from '../dataSource'
import { Preset } from '../model/Preset'

export interface DatabasePreset {
	id?: number
	name: string
	enabled: boolean
	type?: 'e131' | 'osc' | 'http' | 'macro'
	universe?: number | null
	fadeTime?: number
	data?: string | null
	folderId?: string // An unfortunate feature of the mantine select is that it requires a string instead of a number :(
	color?: string
}

export const PresetRepository = dataSource.getRepository(Preset).extend({
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
	async getAll(): Promise<Array<DatabasePreset>> {
		const items = await this.find()
		return items.map((item: Preset) => {
			return {
				name: item.name,
				enabled: item.enabled,
				type: item.type,
				universe: item.universe,
				fadeTime: item.fadeTime !== null ? item.fadeTime : 0,
				data: item.data !== null ? JSON.stringify(item.data) : null,
				folderId: item.folder !== null ? item.folder.id.toString() : null,
				color: item.color !== null ? item.color : '#2C2E33',
			}
		})
	},
	async setAll(presets: Array<DatabasePreset>): Promise<void> {
		await this.delete({})
		// Convert preset back to an object
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const presetsToInsert: Array<{ [key: string]: any }> = presets.map((preset: DatabasePreset, count: number) => {
			return {
				...preset,
				sort: count + 1,
				folder: preset.folderId !== null ? parseInt(preset.folderId) : null,
				data: preset.data !== null && preset.data.length > 0 ? JSON.parse(preset.data) : null,
			}
		})
		await this.insert(presetsToInsert)
	},
})
