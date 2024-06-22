import { ConfigRepository } from './../../database/repository/config'
import { E131 } from './index'

export const createE131 = async () => {
	const enabled = await ConfigRepository.getItem('e131Enabled')
	if (enabled === 'true') {
		const firstUniverse = await ConfigRepository.getItem('e131FirstUniverse')
		const universes = await ConfigRepository.getItem('e131Universes')
		const sourceName = await ConfigRepository.getItem('e131SourceName')
		const priority = await ConfigRepository.getItem('e131Priority')
		const frequency = await ConfigRepository.getItem('e131Frequency')
		const sampleTime = await ConfigRepository.getItem('e131Sampler_time')
		if (!firstUniverse || !universes || !sourceName || !priority || !frequency || !sampleTime)
			throw new Error('Missing E131 configuration')
		globalThis.e131 = new E131(
			parseInt(firstUniverse),
			parseInt(universes),
			sourceName,
			parseInt(priority),
			parseInt(frequency),
			parseInt(sampleTime)
		)
	}
}
export const destroyE131 = (): Promise<void> => {
	return new Promise(resolve => {
		if (globalThis.e131) {
			e131.terminate().then(() => {
				if (globalThis.e131) {
					delete globalThis.e131
				}
				resolve()
			})
		} else resolve()
	})
}
