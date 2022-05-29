import { IconType } from 'react-icons'
import {
	FaVideo,
	FaLightbulb,
	FaRegLightbulb,
	FaVolumeDown,
	FaVolumeMute,
	FaVolumeOff,
	FaVolumeUp,
	FaPhoneVolume,
	FaMicrophone,
	FaMicrophoneAlt,
	FaFolder,
} from 'react-icons/fa'

const Icons: {
	[key: string]: IconType
} = {
	FaLightbulb: FaLightbulb,
	FaRegLightbulb: FaRegLightbulb,
	FaVolumeDown: FaVolumeDown,
	FaVolumeMute: FaVolumeMute,
	FaVolumeOff: FaVolumeOff,
	FaVolumeUp: FaVolumeUp,
	FaPhoneVolume: FaPhoneVolume,
	FaMicrophone: FaMicrophone,
	FaMicrophoneAlt: FaMicrophoneAlt,
	FaVideo: FaVideo,
}

export const PresetFolderIcon = (icon: string): IconType => {
	if (icon in Icons) return Icons[icon]
	else return FaFolder
}
