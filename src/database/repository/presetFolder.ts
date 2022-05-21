import dataSource from '../dataSource'
import { PresetFolders } from '../model/PresetFolders'

export interface DatabasePresetFolder {
	name: string
	id: number
}

export const PresetFolderRepository = dataSource.getRepository(PresetFolders).extend({
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
	async getAll(): Promise<Array<DatabasePresetFolder>> {
		const items = await this.find()
		return items.map((item: PresetFolders) => {
			return {
				name: item.name,
				id: item.id,
			}
		})
	},
})
