import { IconType } from 'react-icons'
import { FaVideo } from '@react-icons/all-files/fa/FaVideo'
import { FaLightbulb } from '@react-icons/all-files/fa/FaLightbulb'
import { FaRegLightbulb } from '@react-icons/all-files/fa/FaRegLightbulb'
import { FaVolumeDown } from '@react-icons/all-files/fa/FaVolumeDown'
import { FaVolumeMute } from '@react-icons/all-files/fa/FaVolumeMute'
import { FaVolumeOff } from '@react-icons/all-files/fa/FaVolumeOff'
import { FaVolumeUp } from '@react-icons/all-files/fa/FaVolumeUp'
import { FaPhoneVolume } from '@react-icons/all-files/fa/FaPhoneVolume'
import { FaMicrophone } from '@react-icons/all-files/fa/FaMicrophone'
import { FaMicrophoneAlt } from '@react-icons/all-files/fa/FaMicrophoneAlt'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'

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
