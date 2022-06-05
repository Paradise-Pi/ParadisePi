import { ConfigRepository } from './../../database/repository/config'
import behrX32 from './behrX32'
import behrXAir from './behrXAir'

export const createOSC = async () => {
    const enabled = await ConfigRepository.getItem('OSCEnabled')
    if (enabled) {
        const OSCTargetIP = await ConfigRepository.getItem('OSCTargetIP')
        const OSCMixerType = await ConfigRepository.getItem('OSCMixerType')
        switch (OSCMixerType) {
            case "xair" :{
                globalThis.osc = new behrXAir(OSCTargetIP);
                break;
            }
            case "x32" : {
                globalThis.osc = new behrX32(OSCTargetIP);
                break;
            }
            default: {
                throw new Error("Invalid console selected");
            }
        }
    }
}