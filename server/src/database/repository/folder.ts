import { In, Not } from 'typeorm'
import { DatabaseFolder } from '../../../../shared/database'
import { parseJSON } from '../../api/parseUserJson'
import dataSource from '../dataSource'
import { Fader } from '../model/Fader'
import { Folders } from '../model/Folder'
import { Preset } from '../model/Preset'

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
				displayVariableLogic: true as any, // https://github.com/typeorm/typeorm/issues/9465
				childFolders: {
					name: true,
					id: true,
					icon: true,
					displayVariableLogic: true as any,
				},
				parent: {
					name: true,
					id: true,
					icon: true,
					displayVariableLogic: true as any,
				},
				presets: {
					id: true,
					name: true,
					color: true,
					icon: true,
					displayVariableLogic: true as any,
				},
				faders: {
					id: true,
					name: true,
					enabled: true,
					type: true,
					channel: true,
					displayVariableLogic: true as any,
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
				displayVariableLogic:
					item.displayVariableLogic !== null ? JSON.stringify(item.displayVariableLogic) : null,
				children: item.childFolders.map((child: Folders) => {
					return {
						name: child.name,
						id: child.id,
						icon: child.icon,
						displayVariableLogic:
							child.displayVariableLogic !== null ? JSON.stringify(child.displayVariableLogic) : null,
					}
				}),
				parent: item.parent
					? {
							name: item.parent.name,
							id: item.parent.id,
							icon: item.parent.icon,
							displayVariableLogic:
								item.parent.displayVariableLogic !== null
									? JSON.stringify(item.parent.displayVariableLogic)
									: null,
					  }
					: null,
				presets: item.presets.map((preset: Preset) => {
					return {
						id: preset.id,
						name: preset.name,
						httpTriggerEnabled: preset.httpTriggerEnabled,
						color: preset.color !== null ? preset.color : '#2C2E33',
						icon: preset.icon,
						displayVariableLogic:
							preset.displayVariableLogic !== null ? JSON.stringify(preset.displayVariableLogic) : null,
					}
				}),
				faders: item.faders.map((fader: Fader) => {
					return {
						id: fader.id,
						name: fader.name,
						enabled: fader.enabled,
						type: fader.type,
						channel: fader.channel,
						displayVariableLogic:
							fader.displayVariableLogic !== null ? JSON.stringify(fader.displayVariableLogic) : null,
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
			order: {
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
			displayVariableLogic: JSON.stringify(item.displayVariableLogic),
			children: item.childFolders.map((child: Folders) => {
				return {
					name: child.name,
					id: child.id,
					displayVariableLogic:
						child.displayVariableLogic !== null ? JSON.stringify(child.displayVariableLogic) : null,
				}
			}),
			parent: item.parent
				? {
						name: item.parent.name,
						id: item.parent.id,
						icon: item.parent.icon,
						displayVariableLogic:
							item.parent.displayVariableLogic !== null
								? JSON.stringify(item.parent.displayVariableLogic)
								: null,
				  }
				: null,
			presets: item.presets.map((preset: Preset) => {
				return {
					id: preset.id,
					name: preset.name,
					color: preset.color !== null ? preset.color : '#2C2E33',
					icon: preset.icon,
					httpTriggerEnabled: preset.httpTriggerEnabled,
					displayVariableLogic:
						preset.displayVariableLogic !== null ? JSON.stringify(preset.displayVariableLogic) : null,
				}
			}),
			faders: item.faders.map((fader: Fader) => {
				return {
					id: fader.id,
					name: fader.name,
					enabled: fader.enabled,
					type: fader.type,
					channel: fader.channel,
					displayVariableLogic:
						fader.displayVariableLogic !== null ? JSON.stringify(fader.displayVariableLogic) : null,
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
				displayVariableLogic:
					folder.displayVariableLogic !== null && folder.displayVariableLogic.length > 0
						? parseJSON(folder.displayVariableLogic)
						: null,
				parent:
					folder.parentFolderId !== null && folderIdsToKeep.includes(parseInt(folder.parentFolderId)) // Check the parent folder id exists
						? parseInt(folder.parentFolderId)
						: null,
			}
		})
		await this.upsert(foldersToInsert, ['id'])
	},
})
