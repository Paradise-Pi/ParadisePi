import { ConfigRepository } from './../../database/repository/config'
import { E131 } from './index'

export const createE131 = async () => {
	const enabled = await ConfigRepository.getItem('e131Enabled')
	if (enabled === 'true') {
		const firstUniverse = parseInt(await ConfigRepository.getItem('e131FirstUniverse'))
		const universes = parseInt(await ConfigRepository.getItem('e131Universes'))
		const sourceName = await ConfigRepository.getItem('e131SourceName')
		const priority = parseInt(await ConfigRepository.getItem('e131Priority'))
		const frequency = parseInt(await ConfigRepository.getItem('e131Frequency'))
		globalThis.e131 = new E131(firstUniverse, universes, sourceName, priority, frequency)
	}
}
export const destroyE131 = (): Promise<void> => {
	return new Promise(resolve => {
		if (globalThis.e131) {
			e131.terminate().then(() => {
				delete globalThis.e131
				resolve()
			})
		} else resolve()
	})
}
