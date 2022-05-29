import dataSource from './../dataSource'
import { Config } from './../model/Config'

export const ConfigRepository = dataSource.getRepository(Config).extend({
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
})
