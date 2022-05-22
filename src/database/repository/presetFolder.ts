import dataSource from '../dataSource'
import { Preset } from '../model/Preset'
import { PresetFolders } from '../model/PresetFolders'
import { DatabasePreset } from './preset'

export interface DatabasePresetFolder {
	name: string
	id: number
	icon?: string
	children?: Array<DatabasePresetFolder>
	parent?: DatabasePresetFolder
	presets?: Array<DatabasePreset>
}

export const PresetFolderRepository = dataSource.getRepository(PresetFolders).extend({
	/**
	 * Get a list of all folders, in a simple way. Used for selecting the folder a preset belongs to
	 * @returns A list of preset folders
	 */
	async getAll(): Promise<Array<DatabasePresetFolder>> {
		const items = await this.find()
		return items.map((item: PresetFolders) => {
			return {
				name: item.name,
				id: item.id,
			}
		})
	},
	/**
	 * Used to set the left menu bar with all the top level folders
	 * @returns Get all folders that are not a child of another folder
	 */
	async getTopLevelFolders(): Promise<Array<DatabasePresetFolder>> {
		const items = await this.createQueryBuilder('presetFolders').where('parentId IS NULL').getMany()
		return items.map((item: PresetFolders) => {
			return {
				name: item.name,
				id: item.id,
				icon: item.icon,
			}
		})
	},
	/**
	 * Get a particular folder by id
	 * @returns A specific folder, and it's children, and the presets inside it
	 */
	async getOne(id: number): Promise<DatabasePresetFolder> {
		const item = await this.findOneOrFail({
			where: {
				id,
			},
			relations: {
				childFolders: true,
				parent: true,
				presets: true,
			},
		})
		return {
			name: item.name,
			id: item.id,
			icon: item.icon,
			children: item.childFolders.map((child: PresetFolders) => {
				return {
					name: child.name,
					id: child.id,
				}
			}),
			parent: item.parent
				? {
						name: item.parent.name,
						id: item.parent.id,
						icon: item.parent.icon,
				  }
				: null,
			presets: item.presets.map((preset: Preset) => {
				return {
					id: preset.id,
					name: preset.name,
					enabled: preset.enabled,
					color: preset.color !== null ? preset.color : '#2C2E33',
				}
			}),
		}
	},
})
