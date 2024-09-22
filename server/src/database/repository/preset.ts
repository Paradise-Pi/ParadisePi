import { In, Not } from 'typeorm'
import { DatabasePreset, PresetTypes } from '../../../../shared/database'
import { parseJSON } from '../../api/parseUserJson'
import dataSource from '../dataSource'
import { Preset } from '../model/Preset'

export const PresetRepository = dataSource.getRepository(Preset).extend({
	//get all presets
	async getAll(): Promise<Array<DatabasePreset>> {
		const items = await this.find()
		return items.map((item: Preset) => {
			return {
				id: item.id,
				name: item.name,
				type: item.type as PresetTypes,
				icon: item.icon !== null ? item.icon : null,
				universe: item.universe,
				fadeTime: item.fadeTime !== null ? item.fadeTime : 0,
				data: item.data !== null ? JSON.stringify(item.data) : null,
				variableLogic: item.variableLogic !== null ? JSON.stringify(item.variableLogic) : null,
				displayVariableLogic:
					item.displayVariableLogic !== null ? JSON.stringify(item.displayVariableLogic) : null,
				httpTriggerEnabled: item.httpTriggerEnabled,
				folderId: item.folder !== null ? item.folder.id.toString() : null,
				deviceId: item.device !== null ? item.device.id.toString() : null,
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
				universe:
					preset.universe !== null && !isNaN(parseInt(preset.universe)) ? parseInt(preset.universe) : null,
				folder:
					preset.folderId !== null && !isNaN(parseInt(preset.folderId)) ? parseInt(preset.folderId) : null,
				device:
					preset.deviceId !== null && !isNaN(parseInt(preset.deviceId)) ? parseInt(preset.deviceId) : null,
				data: preset.data != null && preset.data.length > 0 ? parseJSON(preset.data) : null,
				variableLogic:
					preset.variableLogic !== null && preset.variableLogic.length > 0
						? parseJSON(preset.variableLogic)
						: null,
				displayVariableLogic:
					preset.displayVariableLogic !== null && preset.displayVariableLogic.length > 0
						? parseJSON(preset.displayVariableLogic)
						: null,
			}
		})
		console.log(presetsToInsert)
		await this.upsert(presetsToInsert, ['id'])
	},
})
