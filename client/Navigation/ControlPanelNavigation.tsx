import { Navbar, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { FaQuestion } from '@react-icons/all-files/fa/FaQuestion'
import React from 'react'
import { DatabaseFolder } from '../../shared/database'
import { ButtonIcon } from '../Components/ControlPanel/ButtonIcon'
import { useAppSelector } from '../apis/redux/mainStore'
import { NavbarItem } from './NavbarItem'
import { useStyles } from './Styles'

const TopLevelFolders = () => {
	const folders = useAppSelector(state => (state.database ? state.database.folders : false))
	const { classes } = useStyles()
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
					Icon={
						<span className={classes.linkIcon}>
							<ButtonIcon icon={item.icon} />
						</span>
					}
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
				<NavbarItem link="help" label="Help" Icon={<FaQuestion className={classes.linkIcon} />} />
			</Navbar.Section>
		</Navbar>
	)
}
