import React from 'react'
import { Navbar, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { FaQuestion } from '@react-icons/all-files/fa/FaQuestion'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'
import { useAppSelector } from './../apis/redux/mainStore'
import { DatabaseFolder } from './../../database/repository/folder'
import { FolderIcon } from './../Components/ControlPanel/FolderIcon'

const TopLevelFolders = () => {
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const topLevelFolders: Array<DatabaseFolder> = []
	if (folders !== false) {
		Object.entries(folders)
			.sort(([, folderA], [, folderB]) => folderA.sort - folderB.sort)
			.forEach(([, value]) => {
				if (value.parent === null) {
					topLevelFolders.push({
						name: value.name,
						id: value.id,
						icon: value.icon,
					})
				}
			})
	}
	return (
		<>
			{topLevelFolders.map(item => (
				<NavbarItem
					key={item.id}
					link={'folder/' + item.id.toString()}
					label={item.name}
					Icon={FolderIcon(item.icon)}
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
				<TopLevelFolders />
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<NavbarItem link="help" label="Help" Icon={FaQuestion} />
			</Navbar.Section>
		</Navbar>
	)
}
