import React, { useState } from 'react'
import { Navbar, Group, Code, Text } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import {
	FaRegLightbulb,
	FaQuestion,
	FaCog,
	FaVolumeUp,
	FaVideo,
} from 'react-icons/fa'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'

export function ControlPanelNavigation() {
	const { classes } = useStyles()
	const { height } = useViewportSize()
	const [active, setActive] = useState('Help') // Default page of help
	return (
		<Navbar
			height={height}
			width={{ sm: 200, md: 200 }}
			p="md"
			className={classes.navbar}
		>
			<Navbar.Section grow>
				<Group className={classes.header} position="apart">
					<Text className={classes.text}>ParadisePi</Text>
					<Code className={classes.version}>v3.1.2</Code>
				</Group>
				<NavbarItem
					link="projector"
					label="Projector"
					Icon={FaVideo}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="sound"
					label="Sound"
					Icon={FaVolumeUp}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="lighting"
					label="Lighting"
					Icon={FaRegLightbulb}
					active={active}
					setActive={setActive}
				/>
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem
					link="help"
					label="Help"
					Icon={FaQuestion}
					active={active}
					setActive={setActive}
				/>
				<NavbarItem
					link="about"
					label="About"
					Icon={FaCog}
					active={active}
					setActive={setActive}
				/>
			</Navbar.Section>
		</Navbar>
	)
}