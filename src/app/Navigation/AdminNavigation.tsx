import React from 'react'
import { Navbar, Group, Code, Text, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { Link } from 'react-router-dom'
import { FaCogs } from '@react-icons/all-files/fa/FaCogs'
import { FaLevelUpAlt } from '@react-icons/all-files/fa/FaLevelUpAlt'
import { FaRegFolder } from '@react-icons/all-files/fa/FaRegFolder'
import { FaDatabase } from '@react-icons/all-files/fa/FaDatabase'
import { FaRegPlayCircle } from '@react-icons/all-files/fa/FaRegPlayCircle'
import { FaWindowClose } from '@react-icons/all-files/fa/FaWindowClose'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'
import { useAppSelector } from './../apis/redux/mainStore'
import { runningInElectron } from '../apis/utilities/version'

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
				{runningInElectron() ? (
					<Link className={cx(classes.link)} to="/controlPanel/help" key="Help">
						<FaWindowClose className={classes.linkIcon} />
						<span>Exit</span>
					</Link>
				) : null}
				<NavbarItem link="configuration" label="Configuration" Icon={FaDatabase} />
				<NavbarItem link="presets" label="Presets" Icon={FaRegPlayCircle} />
				<NavbarItem link="folders" label="Folders" Icon={FaRegFolder} />
				<NavbarItem link="faders" label="Faders" Icon={FaLevelUpAlt} />
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem link="controls" label="Controls" Icon={FaCogs} />
			</Navbar.Section>
		</Navbar>
	)
}
