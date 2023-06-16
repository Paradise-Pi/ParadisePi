import { Avatar, Group, Text } from '@mantine/core'
import React, { forwardRef } from 'react'

import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown'
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft'
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight'
import { FaArrowUp } from '@react-icons/all-files/fa/FaArrowUp'
import { FaFolder } from '@react-icons/all-files/fa/FaFolder'
import { FaLightbulb } from '@react-icons/all-files/fa/FaLightbulb'
import { FaMicrophone } from '@react-icons/all-files/fa/FaMicrophone'
import { FaMicrophoneAlt } from '@react-icons/all-files/fa/FaMicrophoneAlt'
import { FaPhoneVolume } from '@react-icons/all-files/fa/FaPhoneVolume'
import { FaPowerOff } from '@react-icons/all-files/fa/FaPowerOff'
import { FaRegLightbulb } from '@react-icons/all-files/fa/FaRegLightbulb'
import { FaToggleOff } from '@react-icons/all-files/fa/FaToggleOff'
import { FaToggleOn } from '@react-icons/all-files/fa/FaToggleOn'
import { FaVideo } from '@react-icons/all-files/fa/FaVideo'
import { FaVolumeDown } from '@react-icons/all-files/fa/FaVolumeDown'
import { FaVolumeMute } from '@react-icons/all-files/fa/FaVolumeMute'
import { FaVolumeOff } from '@react-icons/all-files/fa/FaVolumeOff'
import { FaVolumeUp } from '@react-icons/all-files/fa/FaVolumeUp'

const iconDatabase = [
	{
		id: 'FaLightbulb',
		name: 'Lightbulb',
		icon: <FaLightbulb />,
	},
	{
		id: 'FaRegLightbulb',
		name: 'Lightbulb',
		icon: <FaRegLightbulb />,
	},
	{
		id: 'FaVolumeUp',
		name: 'Volume Up',
		icon: <FaVolumeUp />,
	},
	{
		id: 'FaVolumeDown',
		name: 'Volume Down',
		icon: <FaVolumeDown />,
	},
	{
		id: 'FaVolumeMute',
		name: 'Volume Mute',
		icon: <FaVolumeMute />,
	},
	{
		id: 'FaVolumeOff',
		name: 'Volume Off',
		icon: <FaVolumeOff />,
	},
	{
		id: 'FaPhoneVolume',
		name: 'Phone',
		icon: <FaPhoneVolume />,
	},
	{
		id: 'FaMicrophone',
		name: 'Microphone',
		icon: <FaMicrophone />,
	},
	{
		id: 'FaMicrophoneAlt',
		name: 'Microphone',
		icon: <FaMicrophoneAlt />,
	},
	{
		id: 'FaVideo',
		name: 'Camera',
		icon: <FaVideo />,
	},
	{
		id: 'FaFolder',
		name: 'Folder',
		icon: <FaFolder />,
	},
	{
		id: 'FaArrowUp',
		name: 'Arrow Up',
		icon: <FaArrowUp />,
	},
	{
		id: 'FaArrowDown',
		name: 'Arrow Down',
		icon: <FaArrowDown />,
	},
	{
		id: 'FaArrowLeft',
		name: 'Arrow Left',
		icon: <FaArrowLeft />,
	},
	{
		id: 'FaArrowRight',
		name: 'Arrow Right',
		icon: <FaArrowRight />,
	},
	{
		id: 'FaPowerOff',
		name: 'Power Off',
		icon: <FaPowerOff />,
	},
	{
		id: 'FaToggleOn',
		name: 'Toggle On',
		icon: <FaToggleOn />,
	},
	{
		id: 'FaToggleOff',
		name: 'Toggle Off',
		icon: <FaToggleOff />,
	},
]

export const availableIcons = () => {
	const icons: {
		[key: string]: string
	} = {}
	iconDatabase.forEach(icon => {
		icons[icon.id] = icon.name
	})
	return icons
}

export const ButtonIcon = (props: { icon: string }) => {
	const icon = iconDatabase.find(icon => icon.id === props.icon)
	if (icon) return icon.icon
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
						<ButtonIcon icon={icon} />
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
