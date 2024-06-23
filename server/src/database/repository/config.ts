import dataSource from '../dataSource'
import { Config } from '../model/Config'

export const ConfigRepository = dataSource.getRepository(Config).extend({
	async getItem(key: string): Promise<string | null> {
		const item = await this.findOne({
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
})
