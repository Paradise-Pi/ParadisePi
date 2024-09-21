import { In, Not } from 'typeorm'
import { DatabaseDevice } from '../../../../shared/sharedTypes'
import dataSource from '../dataSource'
import { Device } from '../model/Device'

export const DeviceRepository = dataSource.getRepository(Device).extend({
	//get all
	async getAll(): Promise<Array<DatabaseDevice>> {
		const items = await this.find()
		return items.map((item: Device) => {
			return {
				id: item.id,
				name: item.name,
				notes: item.notes,
				ip: item.ip,
				port: item.port,
				endpoint: item.endpoint,
				sort: item.sort,
			}
		})
	},
	/**
	 * Delete all existing devices and then upload the given devices
	 * @param devices - An array of devices to set as the database record
	 */
	async setAllFromApp(devices: Array<DatabaseDevice>): Promise<void> {
		const deviceIdsToKeep: Array<number> = devices
			.filter((device: DatabaseDevice) => device.id !== null)
			.map((device: DatabaseDevice) => device.id)
		await this.delete({
			id: Not(In(deviceIdsToKeep)),
		})
		// Convert device back to an object
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const devicesToInsert: Array<{ [key: string]: any }> = devices.map((device: DatabaseDevice, count: number) => {
			return {
				...device,
				sort: count + 10, // +10 to make sure that newly inserted ones with null/0/1 end up at the top
			}
		})
		await this.upsert(devicesToInsert, ['id'])
	},
})
