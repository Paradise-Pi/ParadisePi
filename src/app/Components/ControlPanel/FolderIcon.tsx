import React from 'react'
import { IconType } from '@react-icons/all-files/lib'

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

export const AvailableIcons = {
	FaLightbulb: 'Lightbulb',
	FaRegLightbulb: 'Lightbulb',
	FaVolumeUp: 'Volume Up',
	FaVolumeDown: 'Volume Down',
	FaVolumeMute: 'Volume Mute',
	FaVolumeOff: 'Volume Off',
	FaPhoneVolume: 'Phone',
	FaMicrophone: 'Microphone',
	FaMicrophoneAlt: 'Microphone',
	FaVideo: 'Camera',
}

export const FolderIcon = (icon: string): IconType => {
	if (icon === 'FaLightbulb') return FaLightbulb
	else if (icon === 'FaRegLightbulb') return FaRegLightbulb
	else if (icon === 'FaVolumeDown') return FaVolumeDown
	else if (icon === 'FaVolumeMute') return FaVolumeMute
	else if (icon === 'FaVolumeOff') return FaVolumeOff
	else if (icon === 'FaVolumeUp') return FaVolumeUp
	else if (icon === 'FaPhoneVolume') return FaPhoneVolume
	else if (icon === 'FaMicrophone') return FaMicrophone
	else if (icon === 'FaMicrophoneAlt') return FaMicrophoneAlt
	else if (icon === 'FaVideo') return FaVideo
	else return FaFolder
}
// TODO surely we don't need two functions?
export const FolderIconReact = (props: { icon: string }) => {
	if (props.icon === 'FaLightbulb') return <FaLightbulb />
	else if (props.icon === 'FaRegLightbulb') return <FaRegLightbulb />
	else if (props.icon === 'FaVolumeDown') return <FaVolumeDown />
	else if (props.icon === 'FaVolumeMute') return <FaVolumeMute />
	else if (props.icon === 'FaVolumeOff') return <FaVolumeOff />
	else if (props.icon === 'FaVolumeUp') return <FaVolumeUp />
	else if (props.icon === 'FaPhoneVolume') return <FaPhoneVolume />
	else if (props.icon === 'FaMicrophone') return <FaMicrophone />
	else if (props.icon === 'FaMicrophoneAlt') return <FaMicrophoneAlt />
	else if (props.icon === 'FaVideo') return <FaVideo />
	else return <FaFolder />
}
