import React from 'react'
import { Navbar, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { FaQuestion } from '@react-icons/all-files/fa/FaQuestion'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'
import { useAppSelector } from './../apis/redux/mainStore'
import { DatabasePresetFolder } from './../../database/repository/presetFolder'
import { PresetFolderIcon } from './../Components/ControlPanel/PresetFolderIcon'

const TopLevelPresetFolders = () => {
	const presetFolders = useAppSelector(state => (state.database ? state.database.presetFolders : false))
	const topLevelPresetFolders: Array<DatabasePresetFolder> = []
	if (presetFolders !== false) {
		Object.entries(presetFolders)
			.sort(([, folderA], [, folderB]) => folderA.sort - folderB.sort)
			.forEach(([, value]) => {
				if (value.parent === null) {
					topLevelPresetFolders.push({
						name: value.name,
						id: value.id,
						icon: value.icon,
					})
				}
			})
	}
	return (
		<>
			{topLevelPresetFolders.map(item => (
				<NavbarItem
					key={item.id}
					link={'presetFolder/' + item.id.toString()}
					label={item.name}
					Icon={PresetFolderIcon(item.icon)}
				/>
			))}
		</>
	)
}
export const ControlPanelNavigation = () => {
	const { classes } = useStyles()
	const { height } = useViewportSize()
	return (
		<Navbar height={height} width={{ sm: 200, md: 200 }} p="md" className={classes.navbar}>
			<Navbar.Section grow component={ScrollArea}>
				<TopLevelPresetFolders />
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem link="help" label="Help" Icon={FaQuestion} />
			</Navbar.Section>
		</Navbar>
	)
}
