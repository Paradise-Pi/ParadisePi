import { ConfigRepository } from './../../database/repository/config'
import behringerX32 from './devices/behringer/X32'
import behringerXAir from './devices/behringer/XAir'

export const createOSC = async () => {
	const enabled = await ConfigRepository.getItem('OSCEnabled')
	if (enabled === 'true') {
		const OSCTargetIP = await ConfigRepository.getItem('OSCTargetIP')
		const OSCMixerType = await ConfigRepository.getItem('OSCMixerType')
		if (!OSCTargetIP || !OSCMixerType) return
		if (OSCMixerType === 'xair' || OSCMixerType === 'midas-xair') globalThis.osc = new behringerXAir(OSCTargetIP)
		else if (OSCMixerType === 'x32' || OSCMixerType === 'midas-m32') globalThis.osc = new behringerX32(OSCTargetIP)
		// If no mixer selected then see that as the same as it being disabled
	}
}

export const destroyOSC = () => {
	if (globalThis.osc) {
		osc.terminate()
		delete globalThis.osc
	}
}
