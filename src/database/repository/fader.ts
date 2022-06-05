import dataSource from '../dataSource'
import { Fader } from '../model/Faders'

export interface DatabaseFader {
	id?: number
	name: string
	channel?: number
	enabled: boolean
	data?: string | null
	type: string
	sort: number
}

export const FaderRepository = dataSource.getRepository(Fader).extend({
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
	async getAll(): Promise<Array<DatabaseFader>> {
		const items = await this.find()
		return items.map((item: Fader) => {
			return {
				name: item.name,
				channel: item.channel !== null ? item.channel : 0,
				enabled: item.enabled,
				data: item.data !== null ? JSON.stringify(item.data) : null,
				type: item.type,
				sort: item.sort,
			}
		})
	},
	async setAll(faders: Array<DatabaseFader>): Promise<void> {
		await this.delete({})
		// Convert preset back to an object
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fadersToInsert: Array<{ [key: string]: any }> = faders.map((fader: DatabaseFader, count: number) => {
			return {
				...fader,
				sort: count + 1,
				data: fader.data !== null && fader.data.length > 0 ? JSON.parse(fader.data) : null,
			}
		})
		await this.insert(fadersToInsert)
	},
})
