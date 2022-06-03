import { Paper, Text, Button } from '@mantine/core'
import { useAppSelector } from './../../apis/redux/mainStore'
import React from 'react'
import { Link } from 'react-router-dom'

export const AboutPage = () => {
	const showButton = useAppSelector(state =>
		state.database ? state.database.config.general.adminLinkFromControlPanel : false
	)
	return (
		<>
			<Paper shadow="xl" p="lg" withBorder>
				<Text>ParadisePi</Text>
				<Text>Facility control panel for sACN & OSC, in Electron.</Text>
			</Paper>
			{showButton ? (
				<Link to="/admin/controls">
					<Button variant="default" my={'md'}>
						Exit to Admin
					</Button>
				</Link>
			) : (
				''
			)}
		</>
	)
}
