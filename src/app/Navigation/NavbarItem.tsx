import React, { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { IconType } from 'react-icons'
import { useStyles } from './Styles'

export const NavbarItem = ({
	link,
	label,
	Icon,
	active,
	setActive,
}: {
	link: string
	label: string
	Icon: IconType
	active: string
	setActive: Dispatch<SetStateAction<string>>
}) => {
	const { classes, cx } = useStyles()
	return (
		<Link
			className={cx(classes.link, {
				[classes.linkActive]: label === active,
			})}
			to={link}
			key={label}
			onClick={() => {
				setActive(label)
			}}
		>
			<Icon className={classes.linkIcon} />
			<span>{label}</span>
		</Link>
	)
}
