import React, { forwardRef } from 'react'
import { IconType } from '@react-icons/all-files/lib'
import { Group, SelectItem as MantineSelectItem, Avatar, Text } from '@mantine/core'

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
import { FaArrowUp } from '@react-icons/all-files/fa/FaArrowUp'
import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown'
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft'
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight'
import { FaPowerOff } from '@react-icons/all-files/fa/FaPowerOff'
import { FaToggleOn } from '@react-icons/all-files/fa/FaToggleOn'
import { FaToggleOff } from '@react-icons/all-files/fa/FaToggleOff'

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
	FaFolder: 'Folder',
	FaArrowUp: 'Arrow Up',
	FaArrowDown: 'Arrow Down',
	FaArrowLeft: 'Arrow Left',
	FaArrowRight: 'Arrow Right',
	FaPowerOff: 'Power Off',
	FaToggleOn: 'Toggle On',
	FaToggleOff: 'Toggle Off',
}

export const ButtonIcon = (icon: string): IconType => {
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
	else if (icon === 'FaFolder') return FaFolder
	else if (icon === 'FaArrowUp') return FaArrowUp
	else if (icon === 'FaArrowDown') return FaArrowDown
	else if (icon === 'FaArrowLeft') return FaArrowLeft
	else if (icon === 'FaArrowRight') return FaArrowRight
	else if (icon === 'FaPowerOff') return FaPowerOff
	else if (icon === 'FaToggleOn') return FaToggleOn
	else if (icon === 'FaToggleOff') return FaToggleOff
	else return null
}
// TODO surely we don't need two functions?
export const ButtonIconReact = (props: { icon: string }) => {
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
	else if (props.icon === 'FaFolder') return <FaFolder />
	else if (props.icon === 'FaArrowUp') return <FaArrowUp />
	else if (props.icon === 'FaArrowDown') return <FaArrowDown />
	else if (props.icon === 'FaArrowLeft') return <FaArrowLeft />
	else if (props.icon === 'FaArrowRight') return <FaArrowRight />
	else if (props.icon === 'FaPowerOff') return <FaPowerOff />
	else if (props.icon === 'FaToggleOn') return <FaToggleOn />
	else if (props.icon === 'FaToggleOff') return <FaToggleOff />
	else return <></>
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
	icon: string
	label: string
}

// eslint-disable-next-line react/display-name
export const ButtonIconSelectItem = forwardRef<HTMLDivElement, ItemProps>(
	({ icon, label, ...others }: ItemProps, ref) => (
		<div ref={ref} {...others}>
			<Group noWrap>
				{icon ? (
					<Avatar radius={'xs'} size={'md'}>
						<ButtonIconReact icon={icon} />
					</Avatar>
				) : (
					''
				)}
				<div>
					<Text size="sm">{label !== '' ? label : 'None'}</Text>
				</div>
			</Group>
		</div>
	)
)
