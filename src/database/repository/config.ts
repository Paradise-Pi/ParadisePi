import dataSource from '../dataSource'
import { Config } from '../model/Config'
import { LxConfig } from '../model/LxConfig'
import { SndConfig } from '../model/SndConfig'

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
export const LxConfigRepository = dataSource.getRepository(LxConfig).extend({
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
export const SndConfigRepository = dataSource.getRepository(SndConfig).extend({
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
