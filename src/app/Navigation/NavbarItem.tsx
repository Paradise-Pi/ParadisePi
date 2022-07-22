import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconType } from '@react-icons/all-files/lib'
import { useStyles } from './Styles'

export const NavbarItem = ({ link, label, Icon }: { link: string; label: string; Icon: IconType }) => {
	const location = useLocation()
	const pathLink = location.pathname.replace('/admin/', '').replace('/controlPanel/', '')
	const { classes, cx } = useStyles()
	return (
		<Link
			className={cx(classes.link, {
				[classes.linkActive]: link === pathLink,
			})}
			to={link}
			key={label}
		>
			<Icon className={classes.linkIcon} />
			<span>{label}</span>
		</Link>
	)
}
