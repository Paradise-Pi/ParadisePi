import React, { Dispatch, SetStateAction, useState } from 'react'
import { Navbar, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { FaQuestion } from '@react-icons/all-files/fa/FaQuestion'
import { FaCog } from '@react-icons/all-files/fa/FaCog'
import { useStyles } from './Styles'
import { NavbarItem } from './NavbarItem'
import { useAppSelector } from './../apis/redux/mainStore'
import { DatabasePresetFolder } from './../../database/repository/presetFolder'
import { PresetFolderIcon } from './../Components/ControlPanel/PresetFolderIcon'

const TopLevelPresetFolders = ({
	active,
	setActive,
}: {
	active: string
	setActive: Dispatch<SetStateAction<string>>
}) => {
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
					active={active}
					setActive={setActive}
				/>
			))}
		</>
	)
}
export const ControlPanelNavigation = () => {
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
