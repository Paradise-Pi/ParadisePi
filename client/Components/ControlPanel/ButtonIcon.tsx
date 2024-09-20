import { Avatar, Group, Text } from '@mantine/core'
import React, { forwardRef } from 'react'
import { fontAwesome5IconList } from './fontAwesome5IconList'

export const availableIcons = () => {
	const icons: {
		[key: string]: string
	} = {}
	fontAwesome5IconList.forEach(icon => {
		icons[icon.id] = icon.id
			.replace(/([A-Z])/g, ' $1')
			.trim()
			.replace('Fa ', '')
	})
	return icons
}

export const ButtonIcon = (props: { icon: string }) => {
	const icon = fontAwesome5IconList.find(icon => icon.id === props.icon)
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
