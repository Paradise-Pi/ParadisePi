import { In, Not } from 'typeorm'
import dataSource from '../dataSource'
import { Fader } from '../model/Fader'
import { parseJSON } from './../../api/parseUserJson'

export interface DatabaseFader {
	id?: number
	name: string
	enabled: boolean
	channel: number
	type: string
	sort?: number
	folderId?: string // An unfortunate feature of the mantine select is that it requires a string instead of a number :(
	data?: string | null // TODO remove this if we're not using it
}

export const FaderRepository = dataSource.getRepository(Fader).extend({
	//get all faders
	async getAll(): Promise<Array<DatabaseFader>> {
		const items = await this.find()
		return items.map((item: Fader) => {
			return {
				id: item.id,
				name: item.name,
				enabled: item.enabled,
				channel: item.channel,
				data: JSON.stringify(item.data),
				type: item.type,
				sort: item.sort,
				folderId: item.folder !== null ? item.folder.id.toString() : null,
			}
		})
	},
	/**
	 * Delete all existing faders and then upload the given faders
	 * @param faders - An array of faders to set as the database record
	 */
	async setAllFromApp(faders: Array<DatabaseFader>): Promise<void> {
		const faderIdsToKeep: Array<number> = faders
			.filter((fader: DatabaseFader) => fader.id !== null)
			.map((fader: DatabaseFader) => fader.id)
		await this.delete({
			id: Not(In(faderIdsToKeep)),
		})
		// Convert fader back to an object
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fadersToInsert: Array<{ [key: string]: any }> = faders.map((fader: DatabaseFader, count: number) => {
			if (['main/st', 'main/m', 'lr'].includes(fader.type)) fader.channel = 1 // Master faders have no channel so set to 1
			return {
				...fader,
				sort: count + 10, // +10 to make sure that newly inserted ones with null/0/1 end up at the top
				folder: fader.folderId !== null ? parseInt(fader.folderId) : null,
				data: fader.data !== null && fader.data.length > 0 ? parseJSON(fader.data) : null,
			}
		})
		await this.upsert(fadersToInsert, ['id'])
	},
})
