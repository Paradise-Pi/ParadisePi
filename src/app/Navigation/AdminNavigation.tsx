import React, { useState } from 'react'
import { Navbar, Group, Code, Text, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'

import {
	FaCogs,
	FaSort,
	FaLevelUpAlt,
	FaRegFolder,
	FaRegSave,
	FaDatabase,
	FaBars,
} from 'react-icons/fa'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'
import { ApiCall } from '../Apis/wrapper'
import { useAppSelector } from '../Apis/mainStore'
function getMe() {
	ApiCall.put('/refreshDatabase', {})
}
export function AdminNavigation() {
	const { classes } = useStyles()
	const { height } = useViewportSize()
	const database = useAppSelector(state =>
		state.database ? state.database.message : ''
	)

	const [active, setActive] = useState('Help') // Default page of help
	return (
		<Navbar
			height={height}
			width={{ xs: 200, sm: 200, md: 200 }}
			p="md"
			className={classes.navbar}
		>
			<Navbar.Section grow component={ScrollArea}>
				<Group className={classes.header} position="apart">
					<Text className={classes.text}>ParadisePi Admin</Text>
					<Code className={classes.version} onClick={() => getMe()}>
						{database}
					</Code>
				</Group>
				<NavbarItem
					link="configuration"
					label="Configuration"
					Icon={FaDatabase}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="menus"
					label="Menus"
					Icon={FaBars}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="folders"
					label="Folders"
					Icon={FaRegFolder}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="presets"
					label="Presets"
					Icon={FaRegSave}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="faders"
					label="Faders"
					Icon={FaLevelUpAlt}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="sorting"
					label="Sorting"
					Icon={FaSort}
					active={active}
					setActive={setActive}
				/>
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem
					link="controls"
					label="Controls"
					Icon={FaCogs}
					active={active}
					setActive={setActive}
				/>
			</Navbar.Section>
		</Navbar>
	)
}
