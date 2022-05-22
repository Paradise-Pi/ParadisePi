import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Navbar, Group, Code, Text, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { FaRegLightbulb, FaQuestion, FaCog, FaVolumeUp, FaVideo } from 'react-icons/fa'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'
import { useAppSelector } from '../Apis/mainStore'
import { DatabasePresetFolder } from './../../database/repository/presetFolder'
import { PresetFolderIcon } from '../Components/ControlPanel/PresetFolderIcon'

const TopLevelPresetFolders = ({
	active,
	setActive,
}: {
	active: string
	setActive: Dispatch<SetStateAction<string>>
}) => {
	const topLevelPresetFolders = useAppSelector(state =>
		state.database ? state.database.folders.topLevelFolders : []
	)
	const [topLevelPresetFolderItems, setTopLevelPresetFolderItems] = useState<Array<DatabasePresetFolder>>([])
	useEffect(() => {
		if (topLevelPresetFolders.length > 0)
			setTopLevelPresetFolderItems(topLevelPresetFolders.map(item => ({ ...item }))) // Make a copy of the presets using map because the object is not extensible
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [topLevelPresetFolders])
	return (
		<>
			{topLevelPresetFolderItems.map(item => (
				<NavbarItem
					key={item.id}
					link={'presetFolder/' + item.id.toString()}
					label={item.name}
					Icon={PresetFolderIcon(item.icon)}
					active={active}
					setActive={setActive}
				/>
			))}
		</>
	)
}
export function ControlPanelNavigation() {
	const { classes } = useStyles()
	const { height } = useViewportSize()
	const [active, setActive] = useState('Help') // Default page of help
	return (
		<Navbar height={height} width={{ sm: 200, md: 200 }} p="md" className={classes.navbar}>
			<Navbar.Section grow component={ScrollArea}>
				{/*<Group className={classes.header} position="apart">
					<Text className={classes.text}>Paradise</Text>
				</Group>*/}
				<TopLevelPresetFolders active={active} setActive={setActive} />
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem link="help" label="Help" Icon={FaQuestion} active={active} setActive={setActive} />
				<NavbarItem link="about" label="About" Icon={FaCog} active={active} setActive={setActive} />
			</Navbar.Section>
		</Navbar>
	)
}
