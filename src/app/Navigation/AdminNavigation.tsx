import React, { useState } from 'react'
import { Navbar, Group, Code, Text, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { Link } from 'react-router-dom'
import { FaCogs, FaLevelUpAlt, FaRegFolder, FaDatabase, FaRegPlayCircle, FaWindowClose } from 'react-icons/fa'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'
import { useAppSelector } from '../Apis/mainStore'
import { runningInElectron } from '../Apis/version'

export const AdminNavigation = () => {
	const { classes, cx } = useStyles()
	const { height } = useViewportSize()
	const version = useAppSelector(state => (state.database ? state.database.about.version : ''))
	const [active, setActive] = useState('Controls') // Default page of help
	return (
		<Navbar height={height} width={{ xs: 200, sm: 200, md: 200 }} p="md" className={classes.navbar}>
			<Navbar.Section grow component={ScrollArea}>
				<Group className={classes.header} position="apart">
					<Text className={classes.text}>Admin</Text>
					<Code className={classes.version}>v{version}</Code>
				</Group>
				{runningInElectron() ? (
					<Link className={cx(classes.link)} to="/controlPanel/help" key="Help">
						<FaWindowClose className={classes.linkIcon} />
						<span>Exit</span>
					</Link>
				) : null}
				<NavbarItem
					link="configuration"
					label="Configuration"
					Icon={FaDatabase}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="presets"
					label="Presets"
					Icon={FaRegPlayCircle}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem link="folders" label="Folders" Icon={FaRegFolder} active={active} setActive={setActive} />
				<NavbarItem link="faders" label="Faders" Icon={FaLevelUpAlt} active={active} setActive={setActive} />
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem link="controls" label="Controls" Icon={FaCogs} active={active} setActive={setActive} />
			</Navbar.Section>
		</Navbar>
	)
}
