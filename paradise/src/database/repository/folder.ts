import { In, Not } from 'typeorm'
import dataSource from '../dataSource'
import { Fader } from '../model/Fader'
import { Folders } from '../model/Folder'
import { Preset } from '../model/Preset'
import { DatabaseFader } from './fader'
import { DatabasePreset } from './preset'

export interface DatabaseFolder {
	name: string
	id: number
	sort?: number
	icon?: string
	infoText?: string
	children?: Array<DatabaseFolder>
	parent?: DatabaseFolder
	parentFolderId?: string
	presets?: Array<DatabasePreset>
	faders?: Array<DatabaseFader>
}

export const FolderRepository = dataSource.getRepository(Folders).extend({
	/**
	 * Get all folders and their contents
	 *
	 * @returns A specific folder, and it's children, and the presets inside it
	 */
	async getAll(): Promise<{ [key: number]: DatabaseFolder }> {
		const item = await this.find({
			select: {
				name: true,
				id: true,
				icon: true,
				sort: true,
				infoText: true,
				childFolders: {
					name: true,
					id: true,
					icon: true,
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
					icon: true,
				},
				faders: {
					id: true,
					name: true,
					enabled: true,
					type: true,
					channel: true,
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
				faders: {
					sort: 'ASC',
				},
			},
			relations: {
				childFolders: true,
				parent: true,
				presets: true,
				faders: true,
			},
		})
		const returnItem: { [key: number]: DatabaseFolder } = {}
		item.forEach((item: Folders) => {
			returnItem[item.id] = {
				name: item.name,
				id: item.id,
				icon: item.icon,
				sort: item.sort,
				infoText: item.infoText,
				children: item.childFolders.map((child: Folders) => {
					return {
						name: child.name,
						id: child.id,
						icon: child.icon,
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
						httpTriggerEnabled: preset.httpTriggerEnabled,
						color: preset.color !== null ? preset.color : '#2C2E33',
						icon: preset.icon,
					}
				}),
				faders: item.faders.map((fader: Fader) => {
					return {
						id: fader.id,
						name: fader.name,
						enabled: fader.enabled,
						type: fader.type,
						channel: fader.channel,
					}
				}),
			}
		})
		return returnItem
	},
	/**
	 * Get a particular folder by id
	 * @remarks not used
	 * @param id - Id of the folder
	 * @returns A specific folder, and it's children, and the presets inside it
	 */
	async getOne(id: number): Promise<DatabaseFolder> {
		const items = await this.find({
			where: {
				id,
			},
			orderBy: {
				sort: 'ASC',
				presets: {
					sort: 'ASC',
				},
			},
			relations: {
				childFolders: true,
				parent: true,
				presets: true,
				faders: true,
			},
		})
		const item = items[0] // Get the first item from the array
		return {
			name: item.name,
			id: item.id,
			icon: item.icon,
			children: item.childFolders.map((child: Folders) => {
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
					icon: preset.icon,
				}
			}),
			faders: item.faders.map((fader: Fader) => {
				return {
					id: fader.id,
					name: fader.name,
					enabled: fader.enabled,
				}
			}),
		}
	},
	/**
	 * Set the database record of folders based on what's been sent from the app, delete the rest
	 * @param folders - Array of folders to put into the database. It will delete all the others
	 */
	async setAllFromApp(folders: Array<DatabaseFolder>): Promise<void> {
		// Delete any other folders
		const folderIdsToKeep: Array<number> = folders
			.filter((folder: DatabaseFolder) => folder.id !== null) // Skip new ones
			.map((folder: DatabaseFolder) => folder.id)
		await this.delete({
			id: Not(In(folderIdsToKeep)),
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const foldersToInsert: Array<{ [key: string]: any }> = folders.map((folder: DatabaseFolder, count: number) => {
			return {
				name: folder.name,
				id: folder.id,
				icon: folder.icon,
				sort: count + 1,
				infoText: folder.infoText,
				parent:
					folder.parentFolderId !== null && folderIdsToKeep.includes(parseInt(folder.parentFolderId)) // Check the parent folder id exists
						? parseInt(folder.parentFolderId)
						: null,
			}
		})
		await this.upsert(foldersToInsert, ['id'])
	},
})
