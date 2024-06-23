import { Code, Group, Navbar, ScrollArea, Text } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { FaCogs } from '@react-icons/all-files/fa/FaCogs'
import { FaDatabase } from '@react-icons/all-files/fa/FaDatabase'
import { FaLevelUpAlt } from '@react-icons/all-files/fa/FaLevelUpAlt'
import { FaRegClock } from '@react-icons/all-files/fa/FaRegClock'
import { FaRegFolder } from '@react-icons/all-files/fa/FaRegFolder'
import { FaRegPlayCircle } from '@react-icons/all-files/fa/FaRegPlayCircle'
import React from 'react'
import { useAppSelector } from '../apis/redux/mainStore'
import { NavbarItem } from './NavbarItem'
import { useStyles } from './Styles'

export const AdminNavigation = () => {
	const { classes, cx } = useStyles()
	const { height } = useViewportSize()
	const version = useAppSelector(state => (state.database ? state.database.about.version : ''))
	return (
		<Navbar height={height} width={{ xs: 200, sm: 200, md: 200 }} p="md" className={classes.navbar}>
			<Navbar.Section grow component={ScrollArea}>
				<Group className={classes.header} style={{ gap: 0 }}>
					<Text className={classes.text} style={{ marginBottom: 0 }}>
						Admin
					</Text>
					<Code className={classes.version}>v{version}</Code>
				</Group>
				<NavbarItem
					link="configuration"
					label="Configuration"
					Icon={<FaDatabase className={classes.linkIcon} />}
				/>
				<NavbarItem link="presets" label="Presets" Icon={<FaRegPlayCircle className={classes.linkIcon} />} />
				<NavbarItem link="folders" label="Folders" Icon={<FaRegFolder className={classes.linkIcon} />} />
				<NavbarItem link="faders" label="Faders" Icon={<FaLevelUpAlt className={classes.linkIcon} />} />
				<NavbarItem
					link="timeClockTriggers"
					label="Timer Presets"
					Icon={<FaRegClock className={classes.linkIcon} />}
				/>
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem link="controls" label="Controls" Icon={<FaCogs className={classes.linkIcon} />} />
			</Navbar.Section>
		</Navbar>
	)
}
