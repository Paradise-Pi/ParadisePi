import dataSource from './../dataSource'
import { Preset } from './../model/Preset'
import { PresetFolders } from './../model/PresetFolders'
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
	 * Get all folders and their contents
	 *
	 * @returns A specific folder, and it's children, and the presets inside it
	 */
	async getAll(): Promise<{ [key: number]: DatabasePresetFolder }> {
		const item = await this.find({
			select: {
				name: true,
				id: true,
				icon: true,
				childFolders: {
					name: true,
					id: true,
				},
				parent: {
					name: true,
					id: true,
					icon: true,
				},
				presets: {
					id: true,
					name: true,
					enabled: true,
					color: true,
				},
			},
			order: {
				sort: 'ASC',
				presets: {
					sort: 'ASC',
				},
				childFolders: {
					sort: 'ASC',
				},
			},
			relations: {
				childFolders: true,
				parent: true,
				presets: true,
			},
		})
		const returnItem: { [key: number]: DatabasePresetFolder } = {}
		item.forEach((item: PresetFolders) => {
			returnItem[item.id] = {
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
		})
		return returnItem
	},
	/**
	 * Get a particular folder by id
	 *
	 * @param id - Id of the folder
	 * @returns A specific folder, and it's children, and the presets inside it
	 */
	async getOne(id: number): Promise<DatabasePresetFolder> {
		const item = await this.find({
			where: {
				id,
			},
			orderBy: {
				sort: 'ASC',
				presets: {
					sort: 'ASC', // TODO get sorting working
				},
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
